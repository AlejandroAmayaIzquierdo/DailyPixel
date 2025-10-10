using System.Reflection;
using Fleck;
using WebSocketBoilerplate;
using WS.Adapters;
using WS.Services;

namespace WS;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var allowedHosts =
            builder
                .Configuration.GetValue<string>("AllowedHosts")
                ?.Split(';', StringSplitOptions.RemoveEmptyEntries) ?? [];

        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                if (allowedHosts.Contains("*"))
                    policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                else
                    policy.WithOrigins(allowedHosts).AllowAnyMethod().AllowAnyHeader();
            });
        });

        var services = builder.FindAndInjectClientBinaryEventHandlers(
            Assembly.GetExecutingAssembly()
        );

        var app = builder.Build();

        string? webSocketConnection =
            builder.Configuration.GetConnectionString("WebSocket")
            ?? throw new Exception("The connection string of WebSocket should be stablish");

        var server = new WebSocketServer(webSocketConnection);

        server.Start(socket =>
        {
            socket.OnOpen = () =>
            {
                if (socket.ConnectionInfo.Headers.TryGetValue("Origin", out string? value))
                {
                    var (playerId, outMsg) = StateService.Game.TryJoin(socket);
                    if (playerId != null)
                    {
                        Console.WriteLine($"New connection: {socket.ConnectionInfo.Id}");
                        byte[] package = JoinEventAdapter.CreatePacket(
                            playerId.Value,
                            playerId.HasValue
                        );
                        socket.Send(package); // send the join packet
                        StateService.BroadCastClients(
                            UserCountEventAdapter.CreatePacket(
                                playerId.Value,
                                StateService.Game.players.Count
                            ),
                            socket
                        );
                        return;
                    }
                    Console.WriteLine($"Connection refused: {outMsg}");
                    socket.Close();
                }
            };
            socket.OnBinary = (data) =>
            {
                // FIXME Global error handling
                app.InvokeEventHandlerBinaryData(services, socket, data);
            };
            socket.OnMessage = async (message) =>
            {
                try
                {
                    await app.InvokeClientEventHandler(services, socket, message);
                }
                catch
                {
                    StateService.Game.Leave(socket.ConnectionInfo.Id);
                    await socket.Send("Error");
                }
            };
            socket.OnError = (error) =>
            {
                Console.WriteLine("Error: " + error.Message);
            };
            socket.OnClose = () =>
            {
                Console.WriteLine("Connection closed");
                StateService.Game.Leave(socket.ConnectionInfo.Id);

                StateService.BroadCastClients(
                    UserCountEventAdapter.CreatePacket(-1, StateService.Game.players.Count),
                    socket
                );
            };
        });

        Console.ReadLine();
    }
}

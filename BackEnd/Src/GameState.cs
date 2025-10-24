using Fleck;
using WS.Models;
using WS.Util;

namespace WS.Services;

public class GameState
{
    public static int MAX_NUM_PLAYER = 100;
    public readonly Dictionary<Guid, Player> players = [];

    public const int BOARD_SIZE = 500;

    public string[,] board = new string[BOARD_SIZE, BOARD_SIZE];

    private int playerCount = 0;

    public GameState()
    {
        ClearBoard();
        FillWithTestData();
    }

    public (int?, string) TryJoin(IWebSocketConnection socket)
    {
        playerCount++;
        if (playerCount >= MAX_NUM_PLAYER)
            return (null, "The server if full");

        Player player = new() { socket = socket, PlayerID = playerCount };
        var isAdded = players.TryAdd(socket.ConnectionInfo.Id, player);

        if (!isAdded)
            return (null, "Error while tying to add the player to the game");
        return (playerCount, string.Empty);
    }

    public bool DrawOnBoard(Int16 x, Int16 y, string color)
    {
        if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE)
            return false;
        board[y, x] = color;
        return true;
    }

    public void ClearBoard()
    {
        for (int y = 0; y < BOARD_SIZE; y++)
        {
            for (int x = 0; x < BOARD_SIZE; x++)
            {
                board[y, x] = "#fff";
            }
        }
    }

    public void FillWithTestData()
    {
        // Dibujar algunos rectángulos de colores
        // for (int y = 50; y < 100; y++)
        // {
        //     for (int x = 50; x < 150; x++)
        //     {
        //         board[y, x] = "#ff0000"; // Rectángulo rojo
        //     }
        // }

        // for (int y = 120; y < 180; y++)
        // {
        //     for (int x = 80; x < 200; x++)
        //     {
        //         board[y, x] = "#00ff00"; // Rectángulo verde
        //     }
        // }

        // for (int y = 200; y < 250; y++)
        // {
        //     for (int x = 100; x < 250; x++)
        //     {
        //         board[y, x] = "#0000ff"; // Rectángulo azul
        //     }
        // }

        // Dibujar una línea diagonal
        for (int i = 0; i < 100; i++)
        {
            board[300 + i, 50 + i] = "#ffff00"; // Línea amarilla
        }

        // Dibujar algunos puntos dispersos
        Random rand = new();
        for (int i = 0; i < 300; i++)
        {
            int x = rand.Next(0, BOARD_SIZE);
            int y = rand.Next(0, BOARD_SIZE);
            string[] colors = ["#ff00ff", "#00ffff", "#ff8800", "#8800ff", "#00ff88"];
            board[y, x] = colors[rand.Next(colors.Length)];
        }

        // Dibujar un patrón de cuadrícula
        for (int y = 350; y < 400; y += 10)
        {
            for (int x = 300; x < 350; x++)
            {
                board[y, x] = "#000000"; // Líneas negras horizontales
            }
        }

        for (int x = 300; x < 350; x += 10)
        {
            for (int y = 350; y < 400; y++)
            {
                board[y, x] = "#000000"; // Líneas negras verticales
            }
        }
    }

    public override string ToString()
    {
        var encodedBoard = RunLengthEncoding.Encode(StateService.Game.board);

        return string.Join(",", encodedBoard);
    }

    public bool Leave(Guid guid)
    {
        var isRemoved = players.Remove(guid, out Player? player);
        Console.WriteLine($"Player {player?.PlayerID} left the game");
        Console.WriteLine($"Players count: {players.Count}");
        return isRemoved;
    }
}

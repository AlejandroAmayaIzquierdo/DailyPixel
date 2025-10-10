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

    public override string ToString()
    {
        var encodedBoard = RunLengthEncoding.Encode(StateService.Game.board);

        return string.Join(",", encodedBoard);
    }

    public bool Leave(Guid guid)
    {
        return players.Remove(guid);
    }
}

import connectDB from "./db";
import { Board, Column } from "./models";

const DEFAULT_COLUMNS = [
  { name: "Nouveaux Patients", order: 0 },
  { name: "En Cours", order: 1 },
  { name: "Terminé", order: 2 },
];

export async function initializeUserBoard(userId: string) {
  try {
    await connectDB();

    const existingBoard = await Board.findOne({ userId, name: "Medical Hub" });

    if (existingBoard) {
      return existingBoard;
    }

    // Create the board
    const board = await Board.create({
      name: "Medical Hub",
      userId,
      columns: [],
    });

    // Create the columns
    const columns = await Promise.all(
      DEFAULT_COLUMNS.map((col) =>
        Column.create({
          ...col,
          userId,
          boardId: board._id,
          patients: [],
        })
      )
    );

    board.columns = columns.map((col) => col._id);
    await board.save();

    return board;
  } catch (err) {
    throw err;
  }
}
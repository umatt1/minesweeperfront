import Api from "./Api";

class PuzzleApi extends Api {
    constructor() {
        super();
    }

    renderPuzzle(puzzle) {
        const newLayout = [];
        for (let rowInd = 0; rowInd < puzzle.height; rowInd++) {
          let row = puzzle.layout.slice(rowInd * puzzle.width, (rowInd * puzzle.width) + puzzle.width);
          newLayout.push(row);
        }
        puzzle.layout = newLayout;
      }
    
      async getPuzzleOfTheDay(token) {
        try {
          let puzzle = await this.get('/puzzle/getPuzzleByDate', token);
          this.renderPuzzle(puzzle);
          return puzzle;
        } catch (error) {
          throw error;
        }
      }
}

export default PuzzleApi;
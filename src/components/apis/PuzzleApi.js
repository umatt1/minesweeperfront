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
          if (error.response.status === 404) {
            try { // 404 = may not exist. let's try creating it
              let puzzle = await this.post('/puzzle/createPuzzleOfTheDay', null, token);
              console.log("successfully created a puzzle")
              this.renderPuzzle(puzzle);
              return puzzle;
            } catch (error) {
              throw error;
            }
          }
          throw error;
        }
      }
}

export default PuzzleApi;
class Api {
  #Root = "/api/";
  #questions = new Questions(this.#Root);
  constructor() {
    console.log("ctor");
  }
  get questions() {
    return this.#questions;
  }
}

class Questions {
    #Root = '';
    constructor(root) {
        // super();
        this.#Root = root + 'questions/';
    }
  async next() {
    const url = this.#Root + "next";
    const response = await fetch(url);
    const json = await response.json();
    // console.log(json);
    return json;
  }
}


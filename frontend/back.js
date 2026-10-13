class Api {
  // Автоматически определяем правильный адрес бэкенда
  #Root =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
      ? "http://localhost:3000/api/" // Если открыто локально через Live Server
      : "/api/"; // Если проект запущен на сервере Layero

  #questions = new Questions(this.#Root);
  constructor() {
    console.log("ctor");
  }
  get questions() {
    return this.#questions;
  }
}

class Questions {
  #Root = "";
  constructor(root) {
    // super();
    this.#Root = root + "questions/";
  }
  async next() {
    const url = this.#Root + "next";
    const response = await fetch(url);
    const json = await response.json();
    // console.log(json);
    return json;
  }
}

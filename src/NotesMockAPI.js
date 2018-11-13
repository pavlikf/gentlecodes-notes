/**
 * mock api for testing
 */
class NotesMockAPI {
    constructor() {
        // create dummy notes database
        this.notesDb = [
            {id: 1, text: "AA"},
            {id: 2, text: "BB"}
        ]
    }

    /**
     * Return all notes from database
     * @returns object
     */
    getAllNotes() {
        return this.notesDb;
    }

    /**
     * find single note from database by given ID
     * @param int id note ID
     * @returns string note
     */
    getNote(id) {
        return this.notesDb.find(element => element.id == id);
    }

    /**
     * update single note with given ID
     * @param int id note ID
     * @param string str note text
     * @returns {boolean} success
     */
    putNote(id, str) {
        let foundIndex = this.notesDb.findIndex(element => element.id == id);
        this.notesDb[foundIndex].text = str;
        return true;
    }

    /**
     * add new note
     * @param string str note text
     * @returns {boolean} success
     */
    postNote(str) {
        let maxId;
        if (this.notesDb.length == 0) {
            maxId = 0;
        } else {
            maxId = Math.max.apply(Math, this.notesDb.map(function (o) {
                return o.id;
            }));
        }
        this.notesDb.push({id: maxId + 1, text: str});
        return true;
    }

    /**
     * delete single note
     * @param id
     */
    deleteNote(id) {
        this.notesDb.splice(this.notesDb.findIndex((element) => element.id === id), 1);
    }
}

export const DataApi = new NotesMockAPI();
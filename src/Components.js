import React from 'react'
import {DataApi} from "./NotesMockAPI";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import localizedStrings from './localization'

/**
 * main App component, handle application logic and render forms
 */
export class NotesApp extends React.Component {
    constructor(props) {
        super(props);
        this.delete = this.delete.bind(this);
        this.insert = this.insert.bind(this);
        this.update = this.update.bind(this);
        this.setLanguage = this.setLanguage.bind(this);
        this.state = {
            statusMessage: '',
            notes: DataApi.getAllNotes()
        }
    }

    /**
     * function to delete note by ID
     * @param int id note id
     */
    delete(id) {
        // API call
        DataApi.deleteNote(id);

        //@TODO handle API errors

        // set local state
        this.setState({
            statusMessage: localizedStrings.messageItemRemoved,
            notes: DataApi.getAllNotes()
        });
    }

    /**
     * function for inserting new note
     * @param Object { id, text } ntoe
     */
    insert(note) {
        // api call
        DataApi.postNote(note.text);

        //@TODO handle API errors

        // set local state
        this.setState({
            statusMessage: localizedStrings.messageItemInserted,
            notes: DataApi.getAllNotes()
        });
    }

    /**
     * function for update existing note
     * @param Object { id, text } note to update - text should contain new text
     */
    update(note) {
        // api call
        DataApi.putNote(note.id, note.text);

        //@TODO handle API errors

        // set local state
        this.setState({
            statusMessage: localizedStrings.formatString(localizedStrings.messageItemUpdated, note.id),
            notes: DataApi.getAllNotes()
        });
    }

    /**
     * switch language
     * @param string lang shortcut of language (cs | en)
     */
    setLanguage(lang) {
        // set localization
        localizedStrings.setLanguage(lang);

        // set local state
        this.setState({
            statusMessage: localizedStrings.messageLangSelected,
        });
    }

    render() {
        return (
            <Router>
                <Route path="/">
                    <div className="container">
                        {/* Language switcher  */}
                        <LangSwitch handleChange={this.setLanguage}/>

                        {/* App header */}
                        <div className="row">
                            <div className="col-12 text-center"><h1>{localizedStrings.appHeader}</h1></div>
                        </div>

                        {/* Status messages */}
                        <Message message={this.state.statusMessage}/>

                        <div className="row margin-top">
                            {/* Left block - note list */}
                            <div className="col-sm-6 bg-white rounded shadow-sm container-inner">
                                <NoteList notes={this.state.notes} delete={this.delete}/>
                                <Link data-test="link-create-note" to="/noteCreate">{localizedStrings.linkCreateNote}</Link>
                            </div>

                            {/* Right block - forms */}
                            <div className="col-sm-6 container-inner">
                                <Route path="/noteCreate" exact
                                       render={() => <NoteForm scenario="insert" handleSubmit={this.insert}/>}
                                />
                                <Route path="/noteUpdate/:id"
                                       render={(props) => <NoteForm scenario="update" {...props}
                                                                    handleSubmit={this.update}/>}
                                />
                            </div>
                        </div>
                    </div>
                </Route>
            </Router>
        );
    }
}

/**
 * language switcher component
 * render links for language change
 */
class LangSwitch extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    /**
     * handle parent change from NotesApp
     * @param string lang language shortcut (cs | en)
     */
    handleChange(lang) {
        this.props.handleChange(lang);
    }

    render() {
        return (
            <div className="text-right lang-switcher">
                <LangLink value={"en"} handleChange={this.handleChange}/>
                <LangLink value={"cs"} handleChange={this.handleChange}/>
            </div>
        );
    }
}

/**
 * render language links for lang switcher
 */
class LangLink extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    // handle parent change from LangSwitch
    handleChange() {
        this.props.handleChange(this.props.value);
    }

    render() {
        return (
            <a onClick={this.handleChange}>{this.props.value}</a>
        );
    }
}

/**
 * render insert / update form component
 */
class NoteForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);

        // init state for update mode (load note from API)
        if (this.props.scenario == 'update') {
            let note = DataApi.getNote(this.props.match.params.id);
            this.state = {id: note.id, text: note.text};
        } else {
            this.state = {id: null, text: ""};
        }
    }

    /**
     * call parent handle submit form NotesApp - coul be insert(note) or update(note)
     * pass note object { id, text } as parameter
     * @param event
     */
    handleSubmit(event) {
        event.preventDefault();
        const note = {id: (this.props.scenario == 'update' ? this.props.match.params.id : null), text: this.state.text};
        this.props.handleSubmit(note);
    }

    /**
     * on change component, for update scenario load note details, else init empty note
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        let note;
        if (nextProps.scenario == 'update') {
            note = DataApi.getNote(nextProps.match.params.id);
            this.setState({id: note.id, text: note.text});
        } else {
            this.setState({id: null, text: ""});
        }
    }

    render() {
        return (
            <div>
                <NoteFormHeader scenario={this.props.scenario} noteId={this.state.id}/>
                <form onSubmit={this.handleSubmit}>
                    <textarea data-test="textarea-note" value={this.state.text} onChange={e => this.setState({text: e.target.value})}
                              rows={3}/><br/>
                    <NoteFormSubmitButton scenario={this.props.scenario}/>
                </form>
            </div>
        );
    }
}

// simple submit buton component
function NoteFormSubmitButton(props) {
    if (props.scenario === 'insert') {
        return <input data-test="button-insert" type="submit" value={localizedStrings.buttonInsert}/>;
    } else {
        return <input data-test="button-update" type="submit" value={localizedStrings.buttonSave}/>;
    }
}

// simple note header
function NoteFormHeader(props) {
    if (props.scenario === 'insert') {
        return <h3>{localizedStrings.headerInsertNote}</h3>;
    } else {
        return <h3>{localizedStrings.formatString(localizedStrings.headerUpdateNote, props.noteId)}</h3>;
    }
}

/**
 * Note list component renders list of notes
 */
class NoteList extends React.Component {
    // handle parent function from NotesApp
    delete(id) {
        this.props.delete(id);
    }

    render() {
        // build notes list
        const notesList = this.props.notes.map((note) => <tr key={note.id}>
            <td width="20px">{note.id}.</td>
            <td>{note.text}</td>
            <td></td>
            <td className="text-right">
                {/* edit button */}
                <Link to={`/noteUpdate/${note.id}`}
                      className="glyphicon glyphicon glyphicon-edit"><span> </span></Link>
                {/* delete button */}
                <Link to="/" className="glyphicon glyphicon glyphicon-trash"
                      onClick={this.delete.bind(this, note.id)}> </Link>
            </td>
        </tr>);

        return (
            <div>
                <h2>{localizedStrings.headerNoteList}</h2>
                <table>
                    <tbody>
                    {notesList}
                    </tbody>
                </table>
            </div>
        );
    }
}

/**
 * message component displays notifications with NoteApp state message received in props
 */
class Message extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.message === '') {
            return null;
        } else {
            return (
                <div className="alert alert-success" role="alert">{this.props.message}</div>
            );
        }
    }
}
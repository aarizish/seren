import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './Components/Navbar'
import {
  MdDeleteOutline,
  MdOutlineSave,
  MdInfoOutline,
  MdOutlinePrivacyTip,
  MdIosShare,
  MdFormatListBulleted,
  MdNoteAdd
} from "react-icons/md";
import Modal from './Components/Modal';

function App() {

  const [notes, setNotes] = useState([])
  const [currentNote, setCurrentNote] = useState({ id: "", title: "", desc: "", date: "" })
  const [modalVisible, setModalVisible] = useState(false)
  const [modalContent, setModalContent] = useState({ title: '', desc: '', buttonVisible: false })
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    let myNotes = localStorage.getItem("notes")
    if (myNotes) {
      setNotes(JSON.parse(myNotes))
    }
  }, [])

  const handleChange = (e) => {
    setCurrentNote({ ...currentNote, [e.target.name]: e.target.value })
  }

  const handleSave = (e) => {
    e.preventDefault();
    if (!currentNote.title.trim() && !currentNote.desc.trim()) return;
    let existingIndex = notes.findIndex((note => note.id === currentNote.id))
    if (existingIndex !== -1) {
      const updatedNotes = [...notes]
      updatedNotes[existingIndex] = {
        ...currentNote,
        date: getCurrentDate()
      }
      setNotes(updatedNotes)
      localStorage.setItem("notes", JSON.stringify(updatedNotes))
    } else {
      setNotes([...notes, { id: crypto.randomUUID(), title: currentNote.title, desc: currentNote.desc, date: getCurrentDate() }])
      localStorage.setItem("notes", JSON.stringify([...notes, { id: crypto.randomUUID(), title: currentNote.title, desc: currentNote.desc }]))
    }
    setCurrentNote({ id: "", title: "", desc: "", date: "" })
  }

  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleNew = () => {
    setShowConfirmModal(true)
  }

  const handleDelete = () => {
    if (!currentNote.id) return;
    setModalContent({
      title: "Delete Note",
      desc: "This action will permanently delete the selected note. This cannot be undone.",
      buttonVisible: true,
      buttonText: "Delete Note"
    });
    setShowConfirmDeleteModal(true);
  }

  const confirmDelete = () => {
    const filteredNotes = notes.filter(note => note.id !== currentNote.id)
    setNotes(filteredNotes)
    localStorage.setItem("notes", JSON.stringify(filteredNotes))
    setCurrentNote({ id: "", title: "", desc: "", date: "" });
    setShowConfirmDeleteModal(false)
  }

  const showPrivacyPolicy = () => {
    setModalContent({
      title: "Privacy Policy",
      desc: "Seren doesn’t track you or store your data anywhere except your own browser. There are no accounts, no cloud sync, no third-party services. Just your notes saved locally in your browser’s LocalStorage. We collect no data, run no analytics, and share nothing with anyone. Your notes stay on your device, and if you clear your browser data, they will be deleted. Seren is a personal project with no business model, no telemetry, and no roadmap. Just a simple tool to help you focus. Check out aarizish.in for the repo and source code. Open-source contributions on GitHub are welcome.",
      buttonVisible: false
    });
    setModalVisible(true)
  }

  const showInfo = () => {
    setModalContent({
      title: "About Seren",
      desc: "Seren is a lightweight note-taking app built with Vite and React.js, inspired by Apple’s Notes. It runs entirely in the browser, optimized for desktop users with no backend dependencies. Developed within a focused local environment shaped by an understated but distinct influence, ensuring seamless performance across desktop browsers.",
      buttonVisible: false
    });
    setModalVisible(true)
  }

  const confirmNewNote = () => {
    setCurrentNote({ id: "", title: "", desc: "", date: "" })
  }

  const cancelNewNote = () => {
    setShowConfirmModal(false);
  };

  const shareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Seren: Notes, Locally Yours',
        text: 'Try Seren: no sync, no accounts. Just local notes that stay yours.',
        url: 'https://seren.aarizish.in/'
      }).catch((err) => console.log('Share failed:', err));
    } else {
      setModalContent({
        title: "Seren: Notes, Locally Yours",
        desc: "Send this link to share Seren: https://seren.aarizish.in/",
        buttonVisible: false
      });
      setModalVisible(true);
    }
  }

  return (
    <>
      <Navbar />
      <div className='navbar'>
        <div>
          <MdFormatListBulleted className='icon-style selected' />
        </div>
        <div>
          <MdNoteAdd onClick={handleNew} className='icon-style' />
          <MdDeleteOutline onClick={handleDelete} className='icon-style' />
          <MdOutlineSave onClick={handleSave} className='icon-style' />
        </div>
        <div>
          <MdInfoOutline onClick={showInfo} className='icon-style' />
          <MdOutlinePrivacyTip onClick={showPrivacyPolicy} className='icon-style' />
          <MdIosShare onClick={shareApp} className='icon-style' />
          <form onSubmit={(e) => { e.preventDefault() }}>
            <input type='text' placeholder='🔍 Search' id='query' value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value)}} />
          </form>
        </div>
      </div>
      <div className='notes-view'>
        <div className="notes-list">
          <p id='my-notes-text'>My Notes</p>
          <ul>
            {notes && notes
            .filter(note => {
              let query = searchQuery.toLowerCase()
              return(
                note.title.toLowerCase().includes(query) ||
                note.desc.toLowerCase().includes(query)
              )
            })
            .map(note => {
              return <li key={note.id} onClick={() => { setCurrentNote({ id: note.id, title: note.title, desc: note.desc, date: note.date }) }}>
                <h4 id='list-title'>{(note.title.length <= 30 ? note.title : note.title.substring(0, 30).trim() + "...")}</h4>
                <div className='list-desc'>
                  <p>{note.date}</p>
                  <p id='list-main-desc'>{(note.desc.length <= 25 ? note.desc : note.desc.substring(0, 20).trim() + "...")}</p>
                </div>
              </li>
            })}
            {notes.length == 0 && <li key="no-note">
              <h4 id='list-title'>Your Space, Your Notes</h4>
              <div className='list-desc'>
                <p id='list-main-desc'>Ready to get started? Create your first note and it'll show up here!</p>
              </div>
            </li>
            }
          </ul>
        </div>
        <div className='notes-editor'>
          <form onSubmit={handleSave}>
            <input type='text' id='note-title' onChange={handleChange} name="title" value={currentNote.title} autoFocus />
            <textarea id='note-description' onChange={handleChange} name="desc" value={currentNote.desc}></textarea>
          </form>
        </div>
      </div>
      <Modal visible={modalVisible} title={modalContent.title} desc={modalContent.desc} buttonVisible={modalContent.buttonVisible} buttonText="Got it" onButtonPress={() => setModalVisible(false)} onClose={() => setModalVisible(false)} />
      {showConfirmModal && (
        <Modal
          visible={true}
          title="Create New Note"
          desc="Unsaved work will be discarded"
          buttonVisible={true}
          buttonText="Confirm"
          onButtonPress={() => {
            confirmNewNote()
            setShowConfirmModal(false)
          }}
          onClose={cancelNewNote}
        />
      )}
      {showConfirmDeleteModal && (
      <Modal
        visible={showConfirmDeleteModal}
        title={modalContent.title}
        desc={modalContent.desc}
        buttonVisible={modalContent.buttonVisible}
        buttonText={modalContent.buttonText}
        onButtonPress={confirmDelete}
        onClose={() => setShowConfirmDeleteModal(false)}
      />
    )}
    </>
  )
}

export default App

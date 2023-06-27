import { useEffect, useRef, useState } from "react";
import { View, TextInput } from "react-native";
import { useContext } from "react";
import NoteContext from "../../context/NoteContext";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function FormPage({ navigation, route }) {
  const inputTitle = useRef();

  // get collection reference
  const colRef = collection(db, "noteCollection");

  const titleRef = useRef(null);
  const noteRef = useRef(null);

  const [stateTitle, setStateTitle] = useState(titleRef.current);
  const [stateNote, setStateNote] = useState(noteRef.current);

  const { notes, setNotes } = useContext(NoteContext);

  useEffect(() => {
    inputTitle.current?.focus();
    if (route.params) {
      const { title, note } = route.params;
      titleRef.current = title;
      noteRef.current = note;
      setStateTitle(titleRef.current);
      setStateNote(noteRef.current);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", async () => {
      if (titleRef.current || noteRef.current) {
        if (route.params) {
          updateNoteContext();
        } else {
          await addNoteToContext();
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const updateNoteContext = () => {
    const newNotes = notes.map((data) => {
      if (data.id === route.params.id) {
        data.title = titleRef.current;
        data.note = noteRef.current;
      }
      return data;
    });
    setNotes(newNotes);
  };

  const addNoteToContext = async () => {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        {
          title: titleRef.current,
          note: noteRef.current,
        },
      ];
    });
    await addDoc(colRef, {
      title: titleRef.current,
      note: noteRef.current,
    });
  };

  const addInputTitle = (textTitle) => {
    setStateTitle(textTitle);
    titleRef.current = textTitle;
  };

  const addInputNote = (textNote) => {
    setStateNote(textNote);
    noteRef.current = textNote;
  };

  return (
    <View
      style={{
        paddingTop: 130,
        paddingHorizontal: 30,
        backgroundColor: "#fff",
        flex: 1,
      }}
    >
      <TextInput
        style={{
          fontSize: 20,
          marginBottom: 10,
        }}
        placeholder="Title"
        ref={inputTitle}
        value={titleRef.current}
        onChangeText={(textTitle) => addInputTitle(textTitle)}
      />
      <TextInput
        style={{
          fontSize: 17,
        }}
        placeholder="Note"
        onChangeText={(textNote) => addInputNote(textNote)}
        value={noteRef.current}
      />
    </View>
  );
}

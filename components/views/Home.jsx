import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

import NoteContext from "../../context/NoteContext";
import { useContext, useEffect, useState } from "react";
import { FlatList } from "react-native";
import Card from "../atoms/Card";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Home({ navigation }) {
  const { inputBox, topContainer, bottomNav, addButton, header } = styles;

  const [searchTitle, setSearchTitle] = useState("");

  const { notes, setNotes } = useContext(NoteContext);

  // get collection reference
  const colRef = collection(db, "noteCollection");

  useEffect(async () => {
    await getDocs(colRef)
      .then((colRef) => {
        setNotes(colRef.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      })
      .catch((err) => console.log(err));
  }, [colRef?.docs?.length]);

  const goToFormPage = () => {
    navigation.navigate("FormPage");
  };

  const handleSearchChange = (searchText) => {
    setSearchTitle(searchText);
  };

  const filteredNotes =
    notes &&
    notes.filter((data) =>
      data.title.toLowerCase().includes(searchTitle.toLowerCase())
    );

  return (
    <GestureHandlerRootView style={topContainer}>
      <View>
        <TextInput
          style={inputBox}
          placeholder="Search your notes"
          value={searchTitle}
          onChangeText={(searchText) => handleSearchChange(searchText)}
        ></TextInput>
      </View>
      <View
        style={{
          marginTop: 40,
          marginHorizontal: 30,
          flex: 1,
        }}
      >
        <Text style={header}>Notes</Text>
        <FlatList
          data={filteredNotes}
          renderItem={({ item }) => (
            <Card note={item} navigation={navigation} />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View style={bottomNav}>
        <TouchableOpacity onPress={goToFormPage} style={addButton}>
          <Text
            style={{
              fontSize: 25,
            }}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: "300px",
  },

  topContainer: {
    paddingTop: 70,
    backgroundColor: "#fff",
    flex: 1,
  },

  inputBox: {
    marginHorizontal: 18,
    padding: 4,
    paddingLeft: 20,
    backgroundColor: "#eee",
    borderRadius: 15,
  },

  bottomNav: {
    flex: 1,
    position: "absolute",
    width: "100%",
    bottom: 0,
    height: 40,
    backgroundColor: "#eee",

    justifyContent: "center",
    paddingHorizontal: 15,
  },

  addButton: {
    backgroundColor: "#fff",

    padding: 10,
    borderRadius: 15,
    width: 50,
    height: 50,

    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",

    marginBottom: 50,
    marginRight: 10,

    shadowColor: "#000",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },

  header: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 30,
  },
});

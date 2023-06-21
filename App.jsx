import Home from "./components/views/Home";
import FormPage from "./components/views/FormPage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NoteContext from "./context/NoteContext";
import { useState } from "react";

const Stack = createNativeStackNavigator();
export default function App() {
  const [notes, setNotes] = useState([]);
  return (
    <NoteContext.Provider
      value={{
        notes,
        setNotes,
      }}
    >
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="FormPage"
            component={FormPage}
            options={{
              headerTitle: "",
              headerTransparent: true,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NoteContext.Provider>
  );
}

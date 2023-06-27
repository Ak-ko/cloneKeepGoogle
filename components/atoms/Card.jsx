import { useContext, useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import NoteContext from "../../context/NoteContext";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function Card({ note, navigation }) {
  const AnimatedView = Animated.createAnimatedComponent(View);

  const { setNotes } = useContext(NoteContext);

  const translateX = useSharedValue(0);
  const height = useSharedValue(80);
  const opacity = useSharedValue(1);

  const deviceWidth = Dimensions.get("screen").width;

  const [isPress, setIsPress] = useState(false);
  const docRef = doc(db, "noteCollection", note?.id);

  const editFormInput = () => {
    setIsPress(true);

    navigation.navigate("FormPage", {
      id: note.id,
      title: note.title,
      note: note.note,
    });
  };

  const penGesture = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
    },

    onEnd: async () => {
      if (translateX.value < deviceWidth * 0.4) {
        translateX.value = withTiming(0);
      } else {
        translateX.value = withTiming(deviceWidth);
        height.value = withTiming(0);
        opacity.value = withTiming(0);
        await deleteDoc(docRef);
        setNotes((prevNotes) =>
          prevNotes.filter((data) => data.id !== note.id)
        );
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
      height: height.value,
      opacity: opacity.value,
      marginBottom: opacity.value === 1 ? 10 : 0,
      padding: opacity.value === 1 ? 10 : 0,
    };
  });

  const handleGestureStateChange = async (event) => {
    // const { nativeEvent } = event;
    // nativeEvent.translationX = translateX.value;
    // if (nativeEvent.translationX > deviceWidth) {
    //   await deleteDoc(docRef);
    //   setNotes((prevNotes) => prevNotes.filter((data) => data.id !== note.id));
    // }
  };

  return (
    <PanGestureHandler
      onGestureEvent={penGesture}
      onHandlerStateChange={handleGestureStateChange}
    >
      <AnimatedView
        style={[
          {
            borderWidth: 1,
            borderRadius: 8,
          },
          animatedStyle,
        ]}
      >
        <Pressable onLongPress={editFormInput}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {note.title}
          </Text>
          <Text
            style={{
              marginTop: 5,
            }}
          >
            {note.note}
          </Text>
        </Pressable>
      </AnimatedView>
    </PanGestureHandler>
  );
}

// const styles = StyleSheet.create({
//   buttonPressed: {
//     backgroundColor: "#eee",
//   },
// });

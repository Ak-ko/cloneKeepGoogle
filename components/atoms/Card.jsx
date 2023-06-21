import { useContext, useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import NoteContext from "../../context/NoteContext";

export default function Card({ note, navigation }) {
  const AnimatedView = Animated.createAnimatedComponent(View);

  const { setNotes } = useContext(NoteContext);

  const translateX = useSharedValue(0);

  const [isPress, setIsPress] = useState(false);

  const editFormInput = () => {
    setIsPress(true);

    navigation.navigate("FormPage", {
      id: note.id,
      title: note.title,
      note: note.note,
    });
  };

  const penGesture = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.translateX = translateX.value;
    },

    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX;
    },

    onEnd: (_) => {
      translateX.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  });

  const handleGestureStateChange = (event) => {
    const { nativeEvent } = event;
    nativeEvent.translationX = translateX.value;
    if (nativeEvent.velocityX > 100 && nativeEvent.translationX > 200) {
      setNotes((prevNotes) => prevNotes.filter((data) => data.id !== note.id));
    }
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
            paddingHorizontal: 15,
            paddingVertical: 25,
            borderRadius: 8,
            marginBottom: 15,
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

const styles = StyleSheet.create({
  buttonPressed: {
    backgroundColor: "#eee",
  },
});

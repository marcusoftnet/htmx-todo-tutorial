import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { db, auth } from "./config.js";

async function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        reject(new Error("User not authenticated"));
      }
    });
  });
}

export async function addTodo(todoData) {
  const user = await getCurrentUser();
  const userId = user.uid;
  const docRef = await addDoc(collection(db, userId), todoData);
  return { id: docRef.id, ...todoData };
}

export async function getAllTodos() {
  const user = await getCurrentUser();
  const userId = user.uid;
  const snapshot = await getDocs(collection(db, userId));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getTodo(todoId) {
  const user = await getCurrentUser();
  const userId = user.uid;
  const docRef = doc(db, userId, todoId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
}

export async function updateTodo(todoId, updates) {
  const user = await getCurrentUser();
  const userId = user.uid;
  const docRef = doc(db, userId, todoId);
  return await updateDoc(docRef, updates);
}

export async function deleteTodo(todoId) {
  const user = await getCurrentUser();
  const userId = user.uid;
  const docRef = doc(db, userId, todoId);
  await deleteDoc(docRef);
}

export async function toggleTodoCompleted(todoId) {
  const user = await getCurrentUser();
  const userId = user.uid;
  const docRef = doc(db, userId, todoId);

  // Get the current completed status
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const currentCompleted = docSnap.data().completed || false; // Default to false if not set

    // Update with the toggled value
    await updateDoc(docRef, { completed: !currentCompleted });
  } else {
    throw new Error("Todo not found");
  }
}

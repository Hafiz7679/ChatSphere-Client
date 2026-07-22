const users = [
  {
    id: 1,
    name: "John Doe",
    online: true,
    messages: [
      { id: 1, own: false, text: "Hello Hafiz 👋" },
      { id: 2, own: true, text: "Hi John!" },
      { id: 3, own: false, text: "How are you?" },
    ],
  },
  {
    id: 2,
    name: "Alex",
    online: false,
    messages: [
      { id: 1, own: false, text: "See you tomorrow." },
      { id: 2, own: true, text: "Sure 👍" },
    ],
  },
  {
    id: 3,
    name: "Sophia",
    online: true,
    messages: [
      { id: 1, own: false, text: "Good Morning ☀️" },
      { id: 2, own: true, text: "Morning 😊" },
    ],
  },
];

export default users;
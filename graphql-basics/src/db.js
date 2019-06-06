const users = [
  {
    id: 1,
    name: 'Lenny Kuhic',
    username: 'Destiney_Wintheiser',
    email: 'Tyree92@yahoo.com',
    address: 'Vicenta View 6949 Charles Valley 69987 Walter Shoal Apt. 140 Suite 719 Lake Wyattville Nevada',
    country: 'United States Minor Outlying Islands',
    zipcode: '91083',
    phone: '693-479-3529',
    website: 'camden.com',
    company: 'Abbott, Walter and Heller',
    married: true
    },
  {
    id: 2,
    name: 'Whitney Harvey',
    username: 'Carolyne.Murphy36',
    email: 'Idell.Stark@gmail.com',
    address: 'Rudolph Wells 78210 Krajcik Squares 004 Osborne Motorway Apt. 881 Apt. 348 Alejandrintown Kentucky',
    country: 'Jordan',
    zipcode: '58234',
    phone: '163.757.9998 x8456',
    website: 'geoffrey.info',
    company: 'Terry, Kuvalis and Gulgowski',
    married: false
  }
]

const posts = [
  { 
    id: 1,
    title: "The days of old",
    published: false,
    body: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.',
    timestamp: Date.now(),
    author: 1
  },
  {
    id: 2,
    title: "The gods must be crazy",
    published: true,
    body: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
    timestamp: Date.now() - 840000,
    author: 2
  }, 
  {
    id: 3,
    title: "Why do we use it?",
    published: true,
    body: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    timestamp: Date.now() - 8400000,
    author: 1
  }
]

const db = {
  users,
  posts
}

export {db as default}
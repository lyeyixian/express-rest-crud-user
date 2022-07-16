import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import express from 'express'

admin.initializeApp()

const app = express()
const main = express()

main.use('/api/v1', app)
main.use(express.json())
main.use(express.urlencoded({ extended: true }))

const db = admin.firestore()
const userCollection = 'users'

interface User {
  firstName: string
  lastName: string
  email: string
  id: string
  contactNumber: string
}

app.get('/', (req, res) => {
  res.status(204).send('Congrats! The api is working')
})

// Create a user
app.post('/users', async (req, res) => {
  try {
    const { firstName, lastName, email, id, contactNumber } = req.body
    const user: User = {
      firstName,
      lastName,
      email,
      id,
      contactNumber,
    }
    const newDoc = await db.collection(userCollection).add(user)

    res.status(201).send(`Created a new user: ${newDoc.id}`)
  } catch (err) {
    res
      .status(400)
      .send(
        'User should cointain firstName, lastName, email, id and contactNumber!'
      )
  }
})

// Get all users
app.get('/users', async (req, res) => {
  try {
    const usersQuerySnapshot = await db.collection(userCollection).get()
    const users: any[] = []

    usersQuerySnapshot.forEach((doc) => {
      users.push({ id: doc.id, data: doc.data() })
    })
    res.status(200).json(users)
  } catch (err) {
    res.status(500).send(err)
  }
})

// Get a single user
app.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId
    const userDocumentSnapshot = await db
      .collection(userCollection)
      .doc(userId)
      .get()

    if (!userDocumentSnapshot.exists) {
      throw new Error('User not found')
    }

    res
      .status(200)
      .json({ id: userDocumentSnapshot.id, data: userDocumentSnapshot.data() })
  } catch (err) {
    res.status(500).send(err)
  }
})

// Delete a user
app.delete('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId

    db.collection(userCollection).doc(userId).delete()
    res.status(204).send('Document successfully deleted!')
  } catch (err) {
    res.status(500).send(err)
  }
})

// Update a user
app.put('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId
    const data = req.body

    db.collection(userCollection).doc(userId).set(data, { merge: true })
    res.status(200).json({ id: userId })
  } catch (err) {
    res.status(500).send(err)
  }
})

export const api = functions.https.onRequest(main)

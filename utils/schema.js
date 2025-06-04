
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const MockInterview = pgTable('mockInterview', {
    id: serial('id').primaryKey(),
    jsonMockResp: text('jsonMockResp').notNull(),
    jobPosition: varchar('jobPosition').notNull(),
    jobDesc: varchar('jobDesc').notNull(),
    jobExperience: varchar('jobExperience').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt: varchar('createdAt'),
    mockID: varchar('mockID').notNull(),
})

// export const UserAnswer = pgTable('userAnswer', {
//     id: serial('id').primaryKey(),
//     mockIdRef: varchar('mockID').notNull(),
//     question: varchar('question').notNull(),
//     correctAns: text('correctAns'),
//     userAns: text('userAns'),
//     feedback: text('feedback'),
//     rating: varchar('rating'),
//     userEmail: varchar('userEmail'),
//     createdAt: varchar('createdAt'),

// })


export const UserAnswer = pgTable('userAnswer', {
    id: serial('id').primaryKey(),
    mockIdRef: varchar('mockID').notNull(),
    question: varchar('question').notNull(),
    correctAns: text('correctAns'),
    userAns: text('userAns'),
    feedback: text('feedback'),
    rating: varchar('rating'),
    resources: text('resources'), // Add this field for storing resources as JSON string
    userEmail: varchar('userEmail'),
    createdAt: varchar('createdAt'),
})



// quiz schema

// export const QuizAnswer = pgTable('quizAnswer', {
//     id: serial('id').primaryKey(),
//     quizIdRef: varchar('quizID').notNull(),
//     question: varchar('question').notNull(),
//     options: text('options').notNull(), // Store as JSON or comma-separated values
//     correctAnswer: text('correctAnswer').notNull(),
//     userAnswer: text('userAnswer'),
//     isCorrect: boolean('isCorrect'),
//     explanation: text('explanation'), // Optional: Provide explanation for the correct answer
//     userEmail: varchar('userEmail'),
//     createdAt: varchar('createdAt'),
// });


export const QuizAnswer = pgTable('quizAnswer', {
    id: serial('id').primaryKey(),
    jsonMockResp: text('jsonMockResp').notNull(),
    jobPosition: varchar('jobPosition').notNull(),
    jobDesc: varchar('jobDesc').notNull(),
    jobExperience: varchar('jobExperience').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt: varchar('createdAt'),
    mockID: varchar('mockID').notNull(),
});



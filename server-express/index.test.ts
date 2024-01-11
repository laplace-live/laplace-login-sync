import { describe, expect, test } from "bun:test"
import request from 'supertest'
import app from './'

describe('events', () => {
  test('should return the correct response', async () => {
    const response = await request(app).get('/')
    expect(response.statusCode).toBe(200)
  })
})

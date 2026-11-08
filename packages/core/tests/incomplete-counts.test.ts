import { beforeEach, describe, expect, it } from "vitest"
import type { Card, Column, Dashboard } from "../src/types"
import type { Runtime } from "../src/runtime"
import { installRuntime } from "../src/runtime"
import { CARDS, COLUMNS, DASHBOARDS } from "../src/api/constants"
import {
  getIncompleteCounts,
  getIncompletePriorityCounts,
} from "../src/api/operations/get-digest"
import { fallbackCard } from "../src/seed"

/** An in-memory `ClientDB`, keyed `store/key`. */
const rows = new Map<string, unknown>()

const fakeDb = {
  get: (store: string, key: string) =>
    Promise.resolve(rows.get(`${store}/${key}`)),
  getAll: (store: string) =>
    Promise.resolve(
      [...rows.entries()]
        .filter(([composite]) => composite.startsWith(`${store}/`))
        .map(([, value]) => value)
    ),
  set: (store: string, key: string, value: unknown) => {
    rows.set(`${store}/${key}`, value)
    return Promise.resolve()
  },
  delete: (store: string, key: string) => {
    rows.delete(`${store}/${key}`)
    return Promise.resolve()
  },
}

const board = (id: string): Dashboard => ({
  id,
  title: id,
  position: "a0",
  sort: [],
  updatedAt: 1,
  deletedAt: null,
})

const column = (
  id: string,
  dashboardId: string,
  title: string,
  done = false
): Column => ({
  id,
  title,
  position: "a0",
  dashboardId,
  collapsed: false,
  color: "",
  done,
  updatedAt: 1,
  deletedAt: null,
  stamps: {},
})

function put(id: string, columnId: string, priority: string) {
  const card: Card = { ...fallbackCard, id, columnId, priority }
  rows.set(`${CARDS}/${id}`, card)
}

beforeEach(() => {
  rows.clear()
  installRuntime({ db: fakeDb, kv: {} } as unknown as Runtime)
  for (const b of ["a", "b"]) rows.set(`${DASHBOARDS}/${b}`, board(b))
  rows.set(`${COLUMNS}/a-todo`, column("a-todo", "a", "To Do"))
  rows.set(`${COLUMNS}/a-backlog`, column("a-backlog", "a", "Backlog"))
  rows.set(`${COLUMNS}/a-done`, column("a-done", "a", "Done", true))
  rows.set(`${COLUMNS}/b-todo`, column("b-todo", "b", "To Do"))
})

describe("getIncompletePriorityCounts", () => {
  it("splits not-done cards from every board by priority", async () => {
    put("1", "a-todo", "high")
    put("2", "a-todo", "high")
    put("3", "b-todo", "medium")
    put("4", "b-todo", "low")
    put("5", "a-todo", "")

    expect(await getIncompletePriorityCounts()).toEqual({
      total: 5,
      high: 2,
      medium: 1,
      low: 1,
      none: 1,
    })
  })

  it("leaves done cards out", async () => {
    put("1", "a-todo", "high")
    put("2", "a-done", "high")

    const counts = await getIncompletePriorityCounts()
    expect(counts.total).toBe(1)
    expect(counts.high).toBe(1)
  })

  it("counts an unrecognised priority as none, so the parts add up", async () => {
    put("1", "a-todo", "urgent")

    const counts = await getIncompletePriorityCounts()
    expect(counts.none).toBe(1)
    expect(counts.total).toBe(1)
  })

  it("drops Backlog cards only when asked to", async () => {
    put("1", "a-todo", "low")
    put("2", "a-backlog", "low")

    expect((await getIncompletePriorityCounts(false)).total).toBe(2)
    expect((await getIncompletePriorityCounts(true)).total).toBe(1)
  })

  it("agrees with the per-board counts", async () => {
    put("1", "a-todo", "high")
    put("2", "a-backlog", "low")
    put("3", "b-todo", "")

    const perBoard = await getIncompleteCounts(true)
    const total = Object.values(perBoard).reduce((sum, n) => sum + n, 0)
    expect((await getIncompletePriorityCounts(true)).total).toBe(total)
  })
})

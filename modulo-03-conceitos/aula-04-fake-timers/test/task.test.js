import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import Task from "../src/task.js";
import { setTimeout } from "node:timers/promises";

describe("Task Test Suite", () => {
  let _logMock;
  let _task;

  beforeEach(() => {
    _logMock = jest.spyOn(console, console.log.name).mockImplementation();
    _task = new Task();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it.skip("should only run tasks that are due without fake timers (slower)", async () => {
    // Arrange
    const tasks = [
      {
        name: "Task-Will-Run-In-5-Secs",
        dueAt: new Date(Date.now() + 5_000),
        fn: jest.fn(),
      },
      {
        name: "Task-Will-Run-In-10-Secs",
        dueAt: new Date(Date.now() + 10_000),
        fn: jest.fn(),
      },
    ];

    // Act
    _task.save(tasks.at(0));
    _task.save(tasks.at(1));

    _task.run(200);

    await setTimeout(11e3); // same as 11_000 or 11000

    // Assert
    expect(tasks.at(0).fn).toHaveBeenCalled();
    expect(tasks.at(1).fn).toHaveBeenCalled();
  }, 15e3);

  it("should only run tasks that are due with fake timers (faster)", async () => {
    jest.useFakeTimers();

    // Arrange
    const tasks = [
      {
        name: "Task-Will-Run-In-5-Secs",
        dueAt: new Date(Date.now() + 5_000),
        fn: jest.fn(),
      },
      {
        name: "Task-Will-Run-In-10-Secs",
        dueAt: new Date(Date.now() + 10_000),
        fn: jest.fn(),
      },
    ];

    // Act
    _task.save(tasks.at(0));
    _task.save(tasks.at(1));

    _task.run(200);

    // Assert
    jest.advanceTimersByTime(4e3);

    expect(tasks.at(0).fn).not.toHaveBeenCalled();
    expect(tasks.at(1).fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2e3);

    expect(tasks.at(0).fn).toHaveBeenCalled();
    expect(tasks.at(1).fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(4e3);

    expect(tasks.at(1).fn).toHaveBeenCalled();
  });
});

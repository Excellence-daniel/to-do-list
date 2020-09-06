import React from "react";
import Star from "./star.svg";
import "./app.scss";

const taskList = [
  "a List",
  "b list",
  "a List",
  "b list",
  "a List",
  "b list",
  "a List",
  "b list",
];
const folders = [
  { item: "work from home", priority: "high" },
  { item: "sunday service", priority: "low" },
  { item: "work from home", priority: "high" },
  { item: "listen to them podcasts", priority: "med" },
];

export function ToDoList() {
  return (
    <div className="to-do-list">
      <div className="container-fluid">
        <div className="row">
          <div className="col-6">
            <h2>Daniel's To-do List App</h2>
            <h5>Work For Today :</h5>
            <div className="task-list">
              {taskList.map((task) => {
                return (
                  <p>
                    <input
                      type="checkbox"
                      className="checkbox-box"
                      // checked={true}
                    />
                    <label>{task}</label>
                  </p>
                );
              })}
            </div>
          </div>
          <div className="col-6 task-folders">
            <div className="info-tasks">
              <button className="new-task">Add New Task</button>
              <p className="all-task-text">All Tasks</p>
              <div className="priorities">
                <p className="top-info">
                  <span className="priority-ball high"></span>
                  <span className="priority-text">High</span>
                </p>
                <p className="top-info">
                  <span className="priority-ball med"></span>
                  <span className="priority-text">Medium</span>
                </p>
                <p className="top-info">
                  <span className="priority-ball low"></span>
                  <span className="priority-text">Low</span>
                </p>
              </div>
            </div>
            <div>
              {folders.map((list) => (
                <button className={`folder-tab ${list.priority}`}>
                  <img src={Star} className="star" alt="satr" />
                  <span className="list">{list.item}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToDoList;

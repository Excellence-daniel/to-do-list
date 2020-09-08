import React from "react";
import Star from "./star.svg";
import Trash from "./trash.svg";
import "./app.scss";

const NewtaskForm = ({
  itemsCount,
  increaseCount,
  enterFolderName,
  closeATaskInList,
  inputTaskList,
  saveTask,
  setPriority,
}) => {
  const listCount = [...Array(itemsCount).keys()];
  return (
    <div
      className="modal fade"
      id="newTask"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Create a New Task
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              id="close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <span>New Folder Task Name </span>
            <input
              className="form-control task-name"
              onChange={enterFolderName}
              required={true}
            />
            <br />
            <div className="priority">
              <span>Choose Priority</span>
              <select className="form-control" onChange={setPriority}>
                <option selected disabled>
                  Select Priority
                </option>
                <option value="high">High</option>
                <option value="med">Med</option>
                <option value="low">Low</option>
              </select>
            </div>
            <br />
            <div className="task-items">
              <span>Task Items</span>
              <span className="plus" onClick={increaseCount}>
                +
              </span>
            </div>
            {listCount.map((index) => {
              return (
                <p id={index}>
                  <input
                    className="form-control task-item"
                    id={index}
                    onChange={inputTaskList}
                  />
                  <span
                    className="close task-close"
                    onClick={closeATaskInList}
                    id={index}
                  >
                    x
                  </span>
                </p>
              );
            })}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={saveTask}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export class ToDoList extends React.Component {
  state = {
    itemsCount: 1,
    folderName: "",
    priority: "",
    newTask: [],
    allTasks: [],
    currentTask: [],
    currentIndex: null,
  };

  componentDidMount = () => {
    const tasks = this.getFromStorage();
    const currentTask = JSON.parse(localStorage.getItem("currentTask"));
    if (currentTask && currentTask.length) {
      this.setState({ currentTask });
    }
    this.setState({ allTasks: tasks });
  };

  increaseItemCount = () => {
    const { itemsCount } = this.state;
    const newCount = itemsCount + 1;
    this.setState({ itemsCount: newCount });
  };

  closeATaskInList = (e) => {
    const id = e.target.id;
    const { newTask } = this.state;
    if (id) {
      const tag = document.getElementById(id);
      tag.remove();

      const index = Number(id);
      const removeValue = newTask[index];
      let doc = newTask;
      doc = doc.filter((item) => item !== removeValue);
      this.setState({ newTask: [...doc] });
    }
  };

  setPriority = (e) => {
    const {
      target: { value },
    } = e;
    this.setState({ priority: value });
  };

  inputFolderName = (e) => {
    const {
      target: { value },
    } = e;
    this.setState({ folderName: value });
  };

  inputTaskList = (e) => {
    const {
      target: { id: index, value },
    } = e;
    const { newTask } = this.state;
    const doc = newTask;
    doc[Number(index)] = { text: value };
    this.setState({ newTask: doc });
  };

  saveTask = () => {
    const { folderName, newTask, priority } = this.state;
    if (!folderName) {
      return window.alert("you have to give your folder a name");
    }
    if (!newTask.length) {
      return window.alert("you need to add smaller items");
    }
    const task = { folderName, priority, tasks: newTask };
    this.saveToStorage(task);
    this.closeModal();
  };

  saveToStorage = (task) => {
    const allTasks = this.getFromStorage();
    allTasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(allTasks));
    this.setState({ allTasks });
  };

  getFromStorage = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks) {
      return tasks;
    }
    return [];
  };

  closeModal = () => {
    const close = document.getElementById("close");
    close.click();
  };

  deleteTask = (e) => {
    const {
      target: { id },
    } = e;
    const index = Number(id);
    const deleteMe = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (deleteMe === true) {
      const { allTasks } = this.state;
      allTasks.splice(index, 1);
      this.setState({ allTasks });
      localStorage.setItem("tasks", JSON.stringify(allTasks));
    }
  };

  selectATask = (e) => {
    const {
      target: { id },
    } = e;
    const index = Number(id);
    const { allTasks } = this.state;
    const selectedTask = allTasks[index];
    this.setState({ currentTask: selectedTask, currentIndex: index });
  };

  checkTaskList = (e) => {
    const index = Number(e.target.id);
    const { currentTask, currentIndex, allTasks } = this.state;
    const selectedList = currentTask.tasks[index];
    if (!!selectedList.checked) {
      selectedList.checked = false;
    } else {
      selectedList.checked = true;
    }
    currentTask.tasks[index] = selectedList;
    allTasks[currentIndex] = currentTask;
    this.setState({ currentTask, allTasks });
    this.saveCurrentTask(currentTask, allTasks);
  };

  saveCurrentTask = (task, allTasks) => {
    localStorage.setItem("currentTask", JSON.stringify([task]));
    localStorage.setItem("tasks", JSON.stringify(allTasks));
  };

  render() {
    const {
      allTasks,
      currentTask: { tasks = [], folderName },
      currentIndex,
    } = this.state;

    return (
      <div className="to-do-list">
        <div className="container-fluid">
          <div className="row">
            <div className="col-6">
              <h2>Mini To-do List App</h2>
              <h5>{folderName}</h5>
              <div className="task-list">
                {tasks && tasks.length
                  ? tasks.map((task, index) => {
                      return (
                        <p>
                          <input
                            type="checkbox"
                            className="checkbox-box"
                            checked={!!task.checked}
                            id={index}
                            value={task.index}
                            onClick={this.checkTaskList}
                          />
                          <label>{task.text}</label>
                        </p>
                      );
                    })
                  : null}
              </div>
            </div>
            <div className="col-6 task-folders">
              <div className="info-tasks">
                <button
                  className="new-task"
                  data-toggle="modal"
                  data-target="#newTask"
                >
                  Add New Task
                </button>
                <p className="all-task-text">Priorities</p>

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
                {allTasks && allTasks.length ? (
                  allTasks.map((list, index) => (
                    <button
                      className={`folder-tab ${list.priority} ${
                        currentIndex === index && "current-task"
                      }`}
                      id={index}
                      onClick={this.selectATask}
                    >
                      <img src={Star} className="star" alt="satr" id={index} />
                      <span className="list" id={index}>
                        {list.folderName}
                      </span>
                      <img
                        src={Trash}
                        alt="trash"
                        className="trash"
                        id={index}
                        onClick={this.deleteTask}
                      />
                    </button>
                  ))
                ) : (
                  <span className="empty-list">
                    <i>Empty List</i>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <NewtaskForm
          itemsCount={this.state.itemsCount}
          increaseCount={this.increaseItemCount}
          enterFolderName={this.inputFolderName}
          closeATaskInList={this.closeATaskInList}
          inputTaskList={this.inputTaskList}
          saveTask={this.saveTask}
          setPriority={this.setPriority}
          state={this.state}
        />
      </div>
    );
  }
}

export default ToDoList;

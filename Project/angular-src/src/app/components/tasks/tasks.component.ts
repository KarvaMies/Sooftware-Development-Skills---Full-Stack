import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: any[];
  newTask: string;
  user: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
      if (this.user) {
        this.loadTasks();
      }
    },
    err => {
      console.log(err);
    })
  }

  loadTasks() {
    this.authService.getTasks().subscribe(data => {
      this.tasks = data.tasks;
    },
    err => {
      console.log(err);
    });
  }
  
  completeTask(taskId) {
    this.authService.completeTask(taskId).subscribe(data => {
      console.log(data.msg);
      this.loadTasks();
    },
    err => {
      console.log(err);
    });
  }

  deleteTask(taskId) {
    this.authService.deleteTask(taskId).subscribe(data => {
      console.log(data.msg);
      this.loadTasks();
    },
    err => {
      console.log(err);
    });
  }

  addTask() {
    if (this.newTask.trim()) {
      this.authService.addTask(this.newTask.trim()).subscribe(data => {
        console.log(data.msg);
        this.newTask = '';
        this.loadTasks();
      },
      err => {
        console.log(err);
      });
    }
  }

  isTaskCompleted(task: any): boolean {
    return task.completed;
  }
}

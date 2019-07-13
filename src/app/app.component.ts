import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from './services/api.service';
import { SocketService } from './services/socket.service';
import Group from './model/group';
import Message from './model/message';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'socket-client-app';
  groupForm: FormGroup;
  messageForm: FormGroup;
  groups: Group[] = [];
  messages: Message[] = [];
  nameOfGroupJoined: string = null;

  presentGroupId: string = null;

  submittedGroup = false;
  submittedMessage = false;

  username = `user${Math.floor(Math.random() * (1000 - 1) + 1000)}`;
  constructor(
    private api: ApiService,
    private socket: SocketService,
    private formBuilder: FormBuilder,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.groupForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
    this.messageForm = this.formBuilder.group({
      content: ['', Validators.required]
    });
    this.fetchGroups();

    this.socket.group().subscribe(data => {
      this.groups.unshift(data);
    });
  }

  get groupControl() {
    return this.groupForm.controls;
  }

  get messageControl() {
    return this.messageForm.controls;
  }

  groupSubmit() {
    this.submittedGroup = true;
    if (this.groupForm.invalid) {
      return;
    }

    console.log(this.groupForm.value);

    const group: Group = {
      name: this.groupForm.value['name']
    };

    this.api.createGroup(group).subscribe(
      data => {
        console.log(data);
      },
      err => {
        console.log(err);
      }
    );
  }

  fetchGroups() {
    this.api.fetchAllGroups().subscribe(
      data => {
        this.groups = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  joinGroup(group: Group) {
    this.toast.info(`Connecting to ${group.name}`, 'Status', {
      disableTimeOut: true,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing'
    });
    this.fetchMessage(group);
    this.presentGroupId = group._id;

    this.socket.message(group._id).subscribe( data => {
      this.messages.push(data);
    });
  }

  fetchMessage(group: Group) {
    this.api.fetchAllMessages(group._id).subscribe(
      data => {
        this.toast.clear();
        this.toast.success(`${group.name} joined!`, 'Status');
        console.log(data);
        this.messages = data;
        this.nameOfGroupJoined = group.name;
        this.presentGroupId = group._id;
      },
      err => {
        console.log(err);
      }
    );
  }

  createMessage() {
    if (!this.presentGroupId) {
      this.toast.error('Please join a group first!', 'Notice', {
        closeButton: true,
        disableTimeOut: true
      });

      return;
    }
    this.submittedMessage = true;
    if (this.messageForm.invalid) {
      return;
    }

    this.toast.info(`Sending message`, 'Status', {
      disableTimeOut: true,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing'
    });
    const message: Message = {
      groupId: this.presentGroupId,
      username: this.username,
      content: this.messageForm.value['content']
    };

    this.api.sendMessage(message).subscribe(
      data => {
        this.toast.clear();
        this.toast.success(`Message sent!`, 'Status');
        console.log(data);
      },
      err => {
        console.log(err);
      }
    );
  }
}

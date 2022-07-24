export interface Task {
  title: string;
  description: string;
  cardType: string;
  assign: { userId: string; userName: string; userIcon: string };
  label: string;
  sprint: string;
  storyPointEstimate: string;
  pullRequestNumber: number;
  reporter: { userId: string; userName: string; userIcon: string };
}

export interface TaskEntity {
  id?: string;
  title?: string;
  // tag?: string;
  tag?: [{ id: string; name: string; slug: string }];
  statusId?: string;
  projectId?: string;
  boardId?: string;
  typeId?: string;
  description: string;
  storyPoint?: number;
  dueAt?: Date;
  assignId?: string;
  reporterId?: string;
  createdAt: Date;
  updatedAt: Date;
}

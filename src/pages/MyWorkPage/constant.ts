import { ITextPart } from './ReusableSection/TextPart/TextPart';
import { IVisualizeCard } from './VisualizeSection/VisualizeCard/VisualizeCard';

const REUSABLE_SECTION_TEXT: ITextPart[] = [
  {
    subtitle: 'Flexible Grouping',
    heading: 'Group your Boards your way.',
    text: 'Arrange your columns to analyze projects from any angle. Group by status, assignee, priority, and more.'
  },
  {
    subtitle: 'Everything View',
    heading: 'See all your Boards in one view.',
    text: 'Get an overview of where all your team projects stand at a glance with Everything view. See multiple workflows in one view, even if they have different statuses.'
  },
  {
    subtitle: 'Custom Statuses',
    heading: 'Visualize any process with Custom Statuses.',
    text: ' Create unique statuses for any workflow, from sprints to multi-stage processes. Add new statuses or edit existing ones directly in Board view.'
  },
  {
    subtitle: 'Drag & Drop',
    heading: 'Drag-and-drop your updates.',
    text: 'Quickly move tasks through workflows and adjust priorities. Drag and drop a task into any status and move the task up or down to change the priority of the task.'
  }
];

const VISUALIZE_CARD_TEXT: IVisualizeCard[] = [
  {
    listTitle: 'Stay on track with sorting and filtering.',
    listItemText: [
      'Sort tasks in a column by due date, priority, and more',
      'Filter tasks by assignee to only see your work',
      'Add filtered views to your Favorites for future reference'
    ],
    imageUrl: 'https://clickup.com/images/features/kanban-board/board-view-fiter.png'
  },
  {
    listTitle: 'Monitor capacity with Work in Progress Limits.',
    listItemText: [
      "Easily see when there's too much work in a status",
      'Measure workload by sprint points, time estimates, and more',
      'Spot bottlenecks at a glance to ship projects faster'
    ],
    imageUrl: 'https://clickup.com/images/features/kanban-board/board-view-limits.png'
  }
];

export default REUSABLE_SECTION_TEXT;
export { VISUALIZE_CARD_TEXT };

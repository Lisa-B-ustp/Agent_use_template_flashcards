# Spec: occlusion therapy timemeasurement

## Goal (one or two sentences)
Create a responsive web application that helps parents track the daily duration of their child's occlusion therapy (eye patch treatment). 
The application should provide a clear overview of adherence to the prescribed therapy and visualize progress over time
## Users
Parents or guardians of children undergoing occlusion therapy
## Features (numbered, so prompts can refer to them)
F1: Parents can create a profile for their child and define:
- Child's name
- Start date of therapy
- Prescribed daily patching time (e.g., 2, 4, or 6 hours)
- Which eye is being patched (left or right)
F2: A visual illustration of a face with both eyes displayed. Parents can select:
- Left eye patched
- Right eye patched
- The selected eye is highlighted visually.
F3: Parents can start and stop a timer whenever the eye patch is applied.
The system records:
- Start time
- End time
- Total treatment duration
F4: Parents can manually enter therapy durations if they forget to use the timer.
F5: Display progress toward the prescribed daily goal.
Examples:
- 1.5 h of 2 h completed
- Progress bar showing percentage completed
F6: Display all recorded therapy sessions in a chronological list.
For each entry show:
- Date
- Duration
- Goal achieved (Yes/No)
F7: Provide visual charts showing:
- Daily patching duration
- Weekly average duration
- Goal achievement rate
F8: Display:
- Total therapy hours completed
- Number of successful days
- Consecutive-day streak
F9: Interactive chart showing daily therapy duration over time.
- The prescribed duration appears as a horizontal target line so parents can immediately see whether they met the goal.
F10: The application must work seamlessly on smartphones, tablets, and desktop devices.

## Acceptance criteria (how I know a feature works)
Feature 1: Child Profile Setup
- Parent can enter child information.
- Data is saved and available after page refresh.
Feature 2: Eye Selection Visualization
- User can switch between left and right eye.
- Selected eye is visually highlighted.
Feature 3: Daily Therapy Timer
- Timer starts and stops correctly.
- Recorded duration is accurate.
Feature 4: Manual Time Entry
- Parent can add therapy time manually.
- Duration appears in daily records.
Feature 5: Daily Progress Indicator
- Progress updates automatically after new entries.
- Percentage is calculated correctly.
Feature 6: Therapy History
- All entries are listed correctly by date.
- User can view past sessions.
Feature 7: Weekly and Monthly Analytics
- Charts update when new data is added.
- Data matches recorded sessions.
Feature 8: Compliance Dashboard
- Metrics are calculated correctly.
- Successful days are counted accurately.
Feature 9: Visual Progress Graph
- Graph displays daily therapy duration.
- Goal line remains visible.
Parents can identify days with insufficient therapy.
- Feature 10: Mobile-Friendly Interface
- Layout adapts to mobile screens.
- All features remain usable without horizontal scrolling.

## Out of scope (do NOT build)
- Medical diagnosis functionality
- Treatment recommendations
- Communication with doctors
- User authentication and account management (for the first version)
- Multi-child management
- Push notifications
- Integration with hospital systems
- AI-based medical advice

## Look & feel
Design Style
Clean, modern, and family-friendly
Medical but not clinical
Easy to use for non-technical parents
Color Palette
Soft blue (#4F8EF7)
Teal (#3CCFCF)
Light gray backgrounds
Green indicators for goals achieved
Amber or red indicators for missed goals
Visual Elements
Child-friendly eye illustration for selecting the patched eye
Large start/stop timer button
Easy-to-read progress bars
Charts using line and bar graphs
Clear icons for completed and missed days
User Experience
Maximum 2-3 clicks to record a therapy session
Clear dashboard immediately after login/opening the app
Mobile-first design
Responsive charts and statistics
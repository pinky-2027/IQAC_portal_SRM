export const DEFAULT_FACULTY_TEMPLATES = [
  {
    "id": 1,
    "step_number": 1,
    "sheet_name": "Events",
    "template_name": "Events Organized",
    "description": "Step 1: Departmental planned vs actual events, webinars, workshops, and conferences.",
    "schema_json": {
      "title": "Events Organized",
      "sections": [
        {
          "title": "Section 1: Planned Events (As Per Event Planner)",
          "fields": [
            {
              "name": "department",
              "label": "Department",
              "type": "select",
              "options": [
                "BCA",
                "MCA",
                "CS",
                "Cyber Security",
                "AI & ML",
                "Viscom",
                "Fashion Designing",
                "Biotechnology",
                "Mathematics",
                "Commerce (A&F)",
                "Commerce Shift 1",
                "Commerce Shift 2",
                "JMC",
                "LCS",
                "CSE",
                "IT",
                "EEE",
                "ECE",
                "MBA",
                "BBA"
              ],
              "required": true
            },
            {
              "name": "event_planned",
              "label": "Event Planned Title",
              "type": "text",
              "required": true
            },
            {
              "name": "tentative_date",
              "label": "Tentative Date Given",
              "type": "date",
              "required": true
            },
            {
              "name": "duration_days",
              "label": "Duration / Days",
              "type": "number",
              "required": true
            },
            {
              "name": "target_audience",
              "label": "Target Audience",
              "type": "select",
              "options": [
                "Students",
                "Faculty Members",
                "Research Scholars",
                "Industry Professionals",
                "All"
              ],
              "required": false
            },
            {
              "name": "financial_status",
              "label": "Financial Status (Self Support / Management)",
              "type": "select",
              "options": [
                "Self Support",
                "Management Funded",
                "External Sponsorship",
                "Joint Support"
              ],
              "required": true
            }
          ]
        },
        {
          "title": "Section 2: Actual Events Conducted",
          "fields": [
            {
              "name": "event_name",
              "label": "Actual Event Name",
              "type": "text",
              "required": true
            },
            {
              "name": "event_type",
              "label": "Event Type",
              "type": "select",
              "options": [
                "Seminar",
                "Workshop",
                "Conference",
                "Webinar",
                "Guest Lecture",
                "FDP",
                "Symposium",
                "Industrial Visit"
              ],
              "required": true
            },
            {
              "name": "event_scope",
              "label": "Scope of the Event (International/National/State/University Level)",
              "type": "select",
              "options": [
                "International Level",
                "National Level",
                "State Level",
                "University Level",
                "Departmental Level"
              ],
              "required": true
            },
            {
              "name": "guest_details",
              "label": "Guest Details",
              "type": "text",
              "required": false
            },
            {
              "name": "guest_category",
              "label": "Guest Category (National / International / State / University)",
              "type": "select",
              "options": [
                "International Guest",
                "National Level Guest",
                "State Level Guest",
                "University Guest",
                "Industry Expert"
              ],
              "required": false
            },
            {
              "name": "actual_date",
              "label": "Actual Date of Event",
              "type": "date",
              "required": true
            },
            {
              "name": "poster_link",
              "label": "Poster Link",
              "type": "text",
              "required": false
            },
            {
              "name": "sdg_mapping",
              "label": "SDG MAPPING ( NOS)",
              "type": "select",
              "options": [
                "SDG 4 - Quality Education",
                "SDG 8 - Decent Work & Economic Growth",
                "SDG 9 - Industry, Innovation & Infrastructure",
                "SDG 17 - Partnerships for Goals"
              ],
              "required": false
            },
            {
              "name": "website_updation_status",
              "label": "Website Updation Status (Yes / No) (Website updation Mandatory)",
              "type": "select",
              "options": [
                "Yes",
                "No"
              ],
              "required": true
            },
            {
              "name": "social_media_updation_status",
              "label": "Website / social media Updation Status (Yes / No)",
              "type": "select",
              "options": [
                "Yes",
                "No"
              ],
              "required": true
            },
            {
              "name": "website_link",
              "label": "Website link",
              "type": "text",
              "required": false
            },
            {
              "name": "social_media_links",
              "label": "Social Media Links",
              "type": "text",
              "required": false
            },
            {
              "name": "if_no_reason",
              "label": "If No - Specify the Reason",
              "type": "text",
              "required": false
            },
            {
              "name": "participant_count",
              "label": "No of Participants",
              "type": "number",
              "required": true
            },
            {
              "name": "income_audience",
              "label": "Income from Audience in Rs",
              "type": "number",
              "required": false
            },
            {
              "name": "event_report_link",
              "label": "Event Report Link",
              "type": "text",
              "required": false
            },
            {
              "name": "photos_drive_link",
              "label": "Photos Drive Link",
              "type": "text",
              "required": false
            },
            {
              "name": "participants_list_link",
              "label": "Participants List Link / Attendees Details (Link)",
              "type": "text",
              "required": false
            },
            {
              "name": "coordinators_name",
              "label": "Event Coordinators Name",
              "type": "text",
              "required": true
            },
            {
              "name": "remarks",
              "label": "Remarks",
              "type": "text",
              "required": false
            }
          ]
        }
      ]
    }
  },
  {
    "id": 2,
    "step_number": 2,
    "sheet_name": "Achievements",
    "template_name": "Faculty & Student Achievements",
    "description": "Step 2: Section-wise collection of Academic, Co-Curricular, Extra-Curricular, and Social Impact achievements.",
    "schema_json": {
      "title": "Faculty & Student Achievements",
      "sections": [
        {
          "title": "Section 1: Academic Achievements",
          "fields": [
            {
              "name": "faculty_incharge",
              "label": "Faculty Incharge Name",
              "type": "text",
              "required": true
            },
            {
              "name": "department_program",
              "label": "Department / Program",
              "type": "select",
              "options": [
                "BCA",
                "MCA",
                "CS",
                "Cyber Security",
                "AI & ML",
                "Viscom",
                "Fashion Designing",
                "Biotechnology",
                "Mathematics",
                "Commerce (A&F)",
                "Commerce Shift 1",
                "Commerce Shift 2",
                "JMC",
                "LCS",
                "CSE",
                "IT",
                "EEE",
                "ECE",
                "MBA",
                "BBA"
              ],
              "required": true
            },
            {
              "name": "student_name",
              "label": "Student Name",
              "type": "text",
              "required": false
            },
            {
              "name": "roll_no",
              "label": "Roll No.",
              "type": "text",
              "required": false
            },
            {
              "name": "year_semester",
              "label": "Year/Semester",
              "type": "select",
              "options": [
                "1st Year / Sem 1",
                "1st Year / Sem 2",
                "2nd Year / Sem 3",
                "2nd Year / Sem 4",
                "3rd Year / Sem 5",
                "3rd Year / Sem 6",
                "4th Year / Sem 7",
                "4th Year / Sem 8"
              ],
              "required": false
            },
            {
              "name": "achievement_type",
              "label": "Achievement Type (Paper Published / Topper / Certification / Research Project / Patent)",
              "type": "select",
              "options": [
                "Paper Published",
                "Academic Topper",
                "Professional Certification",
                "Research Project Grant",
                "Patent Filed/Granted",
                "Fellowship Award"
              ],
              "required": true
            },
            {
              "name": "level",
              "label": "Level",
              "type": "select",
              "options": [
                "International Level",
                "National Level",
                "State Level",
                "Institutional Level"
              ],
              "required": true
            },
            {
              "name": "description",
              "label": "Description of Achievement",
              "type": "textarea",
              "required": true
            },
            {
              "name": "award_rank",
              "label": "Award / Rank / Medal Received",
              "type": "text",
              "required": false
            },
            {
              "name": "proof_link",
              "label": "Link to Certificate / Evidence Document",
              "type": "text",
              "required": false
            }
          ]
        },
        {
          "title": "Section 2: Co-Curricular Achievements",
          "fields": [
            {
              "name": "cocurricular_faculty_incharge",
              "label": "Faculty Incharge Name",
              "type": "text",
              "required": false
            },
            {
              "name": "cocurricular_department",
              "label": "Department",
              "type": "select",
              "options": [
                "BCA",
                "MCA",
                "CS",
                "Cyber Security",
                "AI & ML",
                "Viscom",
                "Fashion Designing",
                "Biotechnology",
                "Mathematics",
                "Commerce (A&F)",
                "Commerce Shift 1",
                "Commerce Shift 2",
                "JMC",
                "LCS",
                "CSE",
                "IT",
                "EEE",
                "ECE",
                "MBA",
                "BBA"
              ],
              "required": false
            },
            {
              "name": "cocurricular_student_name",
              "label": "Student Name",
              "type": "text",
              "required": false
            },
            {
              "name": "cocurricular_roll_no",
              "label": "Roll No.",
              "type": "text",
              "required": false
            },
            {
              "name": "event_competition",
              "label": "Event / Competition Name",
              "type": "text",
              "required": false
            },
            {
              "name": "role_winner",
              "label": "Role (Participant / Winner)",
              "type": "select",
              "options": [
                "Winner (First Rank)",
                "Runner Up (Second Rank)",
                "Third Place",
                "Participant"
              ],
              "required": false
            },
            {
              "name": "topic_project",
              "label": "Topic / Project Name",
              "type": "text",
              "required": false
            },
            {
              "name": "organizing_institution",
              "label": "Organizing Institution",
              "type": "text",
              "required": false
            },
            {
              "name": "cash_prize",
              "label": "Award / Prize Amount (Rs.)",
              "type": "number",
              "required": false
            }
          ]
        },
        {
          "title": "Section 3: Extra-Curricular Achievements",
          "fields": [
            {
              "name": "extracurricular_faculty_incharge",
              "label": "Faculty Incharge Name",
              "type": "text",
              "required": false
            },
            {
              "name": "extracurricular_department",
              "label": "Department",
              "type": "select",
              "options": [
                "BCA",
                "MCA",
                "CS",
                "Cyber Security",
                "AI & ML",
                "Viscom",
                "Fashion Designing",
                "Biotechnology",
                "Mathematics",
                "Commerce (A&F)",
                "Commerce Shift 1",
                "Commerce Shift 2",
                "JMC",
                "LCS",
                "CSE",
                "IT",
                "EEE",
                "ECE",
                "MBA",
                "BBA"
              ],
              "required": false
            },
            {
              "name": "extracurricular_student_name",
              "label": "Student Name",
              "type": "text",
              "required": false
            },
            {
              "name": "extracurricular_roll_no",
              "label": "Roll No.",
              "type": "text",
              "required": false
            },
            {
              "name": "activity_type",
              "label": "Activity Type (Sports/Cultural/Drama/Photography/etc.)",
              "type": "select",
              "options": [
                "Sports & Athletics",
                "Cultural Performance",
                "Drama / Theatre",
                "Photography & Film",
                "Symposium & Quiz",
                "Other Extra-Curricular"
              ],
              "required": false
            }
          ]
        },
        {
          "title": "Section 4: Social Impact / Volunteering / Leadership",
          "fields": [
            {
              "name": "social_department",
              "label": "Department",
              "type": "select",
              "options": [
                "BCA",
                "MCA",
                "CS",
                "Cyber Security",
                "AI & ML",
                "Viscom",
                "Fashion Designing",
                "Biotechnology",
                "Mathematics",
                "Commerce (A&F)",
                "Commerce Shift 1",
                "Commerce Shift 2",
                "JMC",
                "LCS",
                "CSE",
                "IT",
                "EEE",
                "ECE",
                "MBA",
                "BBA"
              ],
              "required": false
            },
            {
              "name": "social_faculty_incharge",
              "label": "Faculty Incharge Name",
              "type": "text",
              "required": false
            },
            {
              "name": "social_student_name",
              "label": "Student Name",
              "type": "text",
              "required": false
            },
            {
              "name": "social_roll_no",
              "label": "Roll No.",
              "type": "text",
              "required": false
            },
            {
              "name": "social_activity",
              "label": "Social Impact Activity / NSS / NGO Volunteering",
              "type": "text",
              "required": false
            }
          ]
        }
      ]
    }
  },
  {
    "id": 3,
    "step_number": 3,
    "sheet_name": "Publications",
    "template_name": "Research Publications & Papers",
    "description": "Step 3: Journal publications, Scopus/WoS indexing, Scopus IDs, and author details.",
    "schema_json": {
      "title": "Research Publications & Papers",
      "sections": [
        {
          "title": "Section 1: Authorship & Institution Details",
          "fields": [
            {
              "name": "institute_code",
              "label": "Institute Code (e.g. SRMIST_RMP_FSH / E&T / Management)",
              "type": "select",
              "options": [
                "SRM Institute of Science and Technology, Ramapuram",
                "SRM IST - Faculty of Science and Humanities (FSH)",
                "SRM IST - Engineering and Technology (E&T)",
                "SRM IST - Management (FOM)",
                "SRM IST - Architecture (SEAD)"
              ],
              "required": true
            },
            {
              "name": "authors_depts",
              "label": "Department Names of Authors (e.g. BCA_MCA_Maths)",
              "type": "text",
              "required": true
            },
            {
              "name": "first_author",
              "label": "First Author Name & Position",
              "type": "text",
              "required": true
            },
            {
              "name": "corresponding_author",
              "label": "Corresponding Author Name",
              "type": "text",
              "required": true
            },
            {
              "name": "second_author",
              "label": "Second Author Name",
              "type": "text",
              "required": false
            },
            {
              "name": "third_author",
              "label": "Third Author Name",
              "type": "text",
              "required": false
            },
            {
              "name": "other_authors",
              "label": "Greater than Third Authors",
              "type": "text",
              "required": false
            },
            {
              "name": "student_first_author",
              "label": "Name of our Student as First Author",
              "type": "text",
              "required": false
            },
            {
              "name": "scholar_first_author",
              "label": "Name of PhD scholar as First Author",
              "type": "text",
              "required": false
            },
            {
              "name": "phd_supervisor",
              "label": "If contributed by PhD scholar, Name of PhD Supervisor",
              "type": "text",
              "required": false
            },
            {
              "name": "claiming_author",
              "label": "Claiming Author Name",
              "type": "text",
              "required": true
            },
            {
              "name": "scopus_id",
              "label": "Claiming Author Scopus ID (Compulsory)",
              "type": "text",
              "required": true
            },
            {
              "name": "orcid_id",
              "label": "Claiming Author Orcid ID",
              "type": "text",
              "required": false
            },
            {
              "name": "all_authors",
              "label": "All Authors Name",
              "type": "text",
              "required": false
            },
            {
              "name": "all_scopus_ids",
              "label": "All Author(s) Scopus ID",
              "type": "text",
              "required": false
            }
          ]
        },
        {
          "title": "Section 2: Article Metadata & Indexing Details",
          "fields": [
            {
              "name": "article_title",
              "label": "Title of Paper / Article",
              "type": "text",
              "required": true
            },
            {
              "name": "journal_name",
              "label": "Journal Name",
              "type": "text",
              "required": true
            },
            {
              "name": "volume_issue",
              "label": "Volume & Issue Number",
              "type": "text",
              "required": false
            },
            {
              "name": "page_numbers",
              "label": "Page Numbers (e.g. 102-115)",
              "type": "text",
              "required": false
            },
            {
              "name": "pub_year",
              "label": "Year of Publication",
              "type": "select",
              "options": [
                "2026",
                "2025",
                "2024",
                "2023",
                "2022",
                "2021"
              ],
              "required": true
            },
            {
              "name": "issn_isbn",
              "label": "ISSN / ISBN Number",
              "type": "text",
              "required": false
            },
            {
              "name": "doi_link",
              "label": "DOI Link / Web Link",
              "type": "text",
              "required": false
            },
            {
              "name": "indexing",
              "label": "Journal Indexing",
              "type": "select",
              "options": [
                "Scopus Indexed",
                "Web of Science (WoS)",
                "PubMed",
                "UGC CARE List",
                "Peer Reviewed"
              ],
              "required": true
            },
            {
              "name": "quartile",
              "label": "Quartile Ranking",
              "type": "select",
              "options": [
                "Q1 Quartile",
                "Q2 Quartile",
                "Q3 Quartile",
                "Q4 Quartile",
                "Non-Quartile"
              ],
              "required": false
            },
            {
              "name": "impact_factor",
              "label": "Impact Factor",
              "type": "text",
              "required": false
            },
            {
              "name": "citations",
              "label": "Number of Citations",
              "type": "number",
              "required": false
            }
          ]
        }
      ]
    }
  },
  {
    "id": 4,
    "step_number": 4,
    "sheet_name": "univ result analysis",
    "template_name": "University Exam Result Analysis",
    "description": "Step 4: Course pass percentages, test 1, test 2, test 3, and university examination results.",
    "schema_json": {
      "title": "University Exam Result Analysis",
      "sections": [
        {
          "title": "Section 1: Course & Faculty Details",
          "fields": [
            {
              "name": "institution_name",
              "label": "Name of the Institution",
              "type": "select",
              "options": [
                "SRM Institute of Science and Technology, Ramapuram",
                "SRM IST - Faculty of Science and Humanities (FSH)",
                "SRM IST - Engineering and Technology (E&T)",
                "SRM IST - Management (FOM)",
                "SRM IST - Architecture (SEAD)"
              ],
              "required": true
            },
            {
              "name": "month_year",
              "label": "Month & Year",
              "type": "select",
              "options": [
                "August 2024",
                "September 2024",
                "October 2024",
                "November 2024",
                "December 2024",
                "January 2025",
                "February 2025",
                "March 2025",
                "April 2025",
                "May 2025",
                "June 2025",
                "July 2025"
              ],
              "required": true
            },
            {
              "name": "faculty_member",
              "label": "Name of the Faculty Member",
              "type": "text",
              "required": true
            },
            {
              "name": "department",
              "label": "Department",
              "type": "select",
              "options": [
                "BCA",
                "MCA",
                "CS",
                "Cyber Security",
                "AI & ML",
                "Viscom",
                "Fashion Designing",
                "Biotechnology",
                "Mathematics",
                "Commerce (A&F)",
                "Commerce Shift 1",
                "Commerce Shift 2",
                "JMC",
                "LCS",
                "CSE",
                "IT",
                "EEE",
                "ECE",
                "MBA",
                "BBA"
              ],
              "required": true
            },
            {
              "name": "course_title",
              "label": "Title of the Course handled",
              "type": "text",
              "required": true
            },
            {
              "name": "programme_name",
              "label": "Programme under which course is offered",
              "type": "text",
              "required": true
            },
            {
              "name": "year_study",
              "label": "Year of Study",
              "type": "select",
              "options": [
                "I Year",
                "II Year",
                "III Year",
                "IV Year"
              ],
              "required": true
            },
            {
              "name": "semester",
              "label": "Semester (ODD/EVEN)",
              "type": "select",
              "options": [
                "ODD Semester",
                "EVEN Semester"
              ],
              "required": true
            }
          ]
        },
        {
          "title": "Section 2: Internal Assessment Performance (Test 1, Test 2, Test 3)",
          "fields": [
            {
              "name": "test1_month",
              "label": "Test 1 Month",
              "type": "select",
              "options": [
                "August 2024",
                "September 2024",
                "October 2024",
                "November 2024",
                "December 2024",
                "January 2025",
                "February 2025",
                "March 2025",
                "April 2025",
                "May 2025",
                "June 2025",
                "July 2025"
              ],
              "required": false
            },
            {
              "name": "test1_appeared",
              "label": "Test 1 - No of Student Appeared",
              "type": "number",
              "required": false
            },
            {
              "name": "test1_passed",
              "label": "Test 1 - No of Students Passed",
              "type": "number",
              "required": false
            },
            {
              "name": "test1_pass_pct",
              "label": "Test 1 - Pass %",
              "type": "text",
              "required": false
            },
            {
              "name": "test2_month",
              "label": "Test 2 Month",
              "type": "select",
              "options": [
                "August 2024",
                "September 2024",
                "October 2024",
                "November 2024",
                "December 2024",
                "January 2025",
                "February 2025",
                "March 2025",
                "April 2025",
                "May 2025",
                "June 2025",
                "July 2025"
              ],
              "required": false
            },
            {
              "name": "test2_appeared",
              "label": "Test 2 - No of Student Appeared",
              "type": "number",
              "required": false
            },
            {
              "name": "test2_passed",
              "label": "Test 2 - No of Students Passed",
              "type": "number",
              "required": false
            },
            {
              "name": "test2_pass_pct",
              "label": "Test 2 - Pass %",
              "type": "text",
              "required": false
            }
          ]
        },
        {
          "title": "Section 3: Final University Exam Performance",
          "fields": [
            {
              "name": "univ_month_year",
              "label": "Univ Exam - Month & Year",
              "type": "select",
              "options": [
                "August 2024",
                "September 2024",
                "October 2024",
                "November 2024",
                "December 2024",
                "January 2025",
                "February 2025",
                "March 2025",
                "April 2025",
                "May 2025",
                "June 2025",
                "July 2025"
              ],
              "required": true
            },
            {
              "name": "univ_appeared",
              "label": "Univ Exam - No of Student Appeared",
              "type": "number",
              "required": true
            },
            {
              "name": "univ_passed",
              "label": "Univ Exam - No of Students Passed",
              "type": "number",
              "required": true
            },
            {
              "name": "univ_pass_pct",
              "label": "Univ Exam - Pass %",
              "type": "text",
              "required": true
            }
          ]
        }
      ]
    }
  },
  {
    "id": 5,
    "step_number": 5,
    "sheet_name": "Online Courses ",
    "template_name": "Online Courses & MOOCs",
    "description": "Step 5: Student & faculty certifications on NPTEL, SWAYAM, Coursera, and e-Pathshala.",
    "schema_json": {
      "title": "Online Courses & MOOCs",
      "sections": [
        {
          "title": "Section 1: MOOC & SWAYAM Course Details",
          "fields": [
            {
              "name": "institution_name",
              "label": "Name of the Institution",
              "type": "select",
              "options": [
                "SRM Institute of Science and Technology, Ramapuram",
                "SRM IST - Faculty of Science and Humanities (FSH)",
                "SRM IST - Engineering and Technology (E&T)",
                "SRM IST - Management (FOM)",
                "SRM IST - Architecture (SEAD)"
              ],
              "required": true
            },
            {
              "name": "month_year_mis",
              "label": "Month & Year of MIS",
              "type": "select",
              "options": [
                "August 2024",
                "September 2024",
                "October 2024",
                "November 2024",
                "December 2024",
                "January 2025",
                "February 2025",
                "March 2025",
                "April 2025",
                "May 2025",
                "June 2025",
                "July 2025"
              ],
              "required": true
            },
            {
              "name": "department",
              "label": "Department",
              "type": "select",
              "options": [
                "BCA",
                "MCA",
                "CS",
                "Cyber Security",
                "AI & ML",
                "Viscom",
                "Fashion Designing",
                "Biotechnology",
                "Mathematics",
                "Commerce (A&F)",
                "Commerce Shift 1",
                "Commerce Shift 2",
                "JMC",
                "LCS",
                "CSE",
                "IT",
                "EEE",
                "ECE",
                "MBA",
                "BBA"
              ],
              "required": true
            },
            {
              "name": "mooc_course_name",
              "label": "Name of the MOOC course",
              "type": "text",
              "required": true
            },
            {
              "name": "mooc_platform",
              "label": "Specify the MOOCs platform SWAYAM/NPTEL/e-Pathshala/etc.",
              "type": "select",
              "options": [
                "SWAYAM",
                "NPTEL",
                "e-Pathshala",
                "Coursera",
                "edX",
                "Udemy / Other Platform"
              ],
              "required": true
            },
            {
              "name": "course_duration",
              "label": "Duration of course in hours/weeks",
              "type": "text",
              "required": true
            },
            {
              "name": "commencement_date",
              "label": "Date of Commencement",
              "type": "date",
              "required": false
            },
            {
              "name": "completion_date",
              "label": "Date of completion",
              "type": "date",
              "required": false
            },
            {
              "name": "enrolled_students",
              "label": "Number of students enrolled",
              "type": "number",
              "required": true
            },
            {
              "name": "completed_students",
              "label": "Number of students successfully completed the course",
              "type": "number",
              "required": true
            },
            {
              "name": "student_achievement",
              "label": "Any significant achievement by student(s)",
              "type": "text",
              "required": false
            },
            {
              "name": "document_link",
              "label": "Link to the relevant document",
              "type": "text",
              "required": false
            }
          ]
        }
      ]
    }
  },
  {
    "id": 6,
    "step_number": 6,
    "sheet_name": "Faculty Details",
    "template_name": "Faculty Cadre & Experience Details",
    "description": "Step 6: Teaching experience, cadre ratio, designations, retention rate, and service record.",
    "schema_json": {
      "title": "Faculty Cadre & Experience Details",
      "sections": [
        {
          "title": "Section 1: Department Teaching Cadre Overview (A-8C, A-8D & A-8E)",
          "fields": [
            {
              "name": "institution_name",
              "label": "Name of the Institution",
              "type": "select",
              "options": [
                "SRM Institute of Science and Technology, Ramapuram",
                "SRM IST - Faculty of Science and Humanities (FSH)",
                "SRM IST - Engineering and Technology (E&T)",
                "SRM IST - Management (FOM)",
                "SRM IST - Architecture (SEAD)"
              ],
              "required": true
            },
            {
              "name": "month_year",
              "label": "Month & Year",
              "type": "select",
              "options": [
                "August 2024",
                "September 2024",
                "October 2024",
                "November 2024",
                "December 2024",
                "January 2025",
                "February 2025",
                "March 2025",
                "April 2025",
                "May 2025",
                "June 2025",
                "July 2025"
              ],
              "required": true
            },
            {
              "name": "department",
              "label": "Department",
              "type": "select",
              "options": [
                "BCA",
                "MCA",
                "CS",
                "Cyber Security",
                "AI & ML",
                "Viscom",
                "Fashion Designing",
                "Biotechnology",
                "Mathematics",
                "Commerce (A&F)",
                "Commerce Shift 1",
                "Commerce Shift 2",
                "JMC",
                "LCS",
                "CSE",
                "IT",
                "EEE",
                "ECE",
                "MBA",
                "BBA"
              ],
              "required": true
            },
            {
              "name": "total_faculty_count",
              "label": "Total number of faculty in the department",
              "type": "number",
              "required": true
            },
            {
              "name": "professors_count",
              "label": "Number of Professors",
              "type": "number",
              "required": true
            },
            {
              "name": "assoc_prof_count",
              "label": "Number of Associate Professors",
              "type": "number",
              "required": true
            },
            {
              "name": "asst_prof_count",
              "label": "Number of Assistant Professors",
              "type": "number",
              "required": true
            },
            {
              "name": "joined_before_august",
              "label": "Number of full-time faculty presently working in the department since 2024-2024 (Joined before 31st August)",
              "type": "number",
              "required": true
            },
            {
              "name": "retention_rate",
              "label": "Retention rate in the department",
              "type": "text",
              "required": true
            }
          ]
        },
        {
          "title": "Section 2: Individual Faculty Cadre & Service Record",
          "fields": [
            {
              "name": "faculty_name",
              "label": "Name of the Faculty",
              "type": "text",
              "required": true
            },
            {
              "name": "designation",
              "label": "Designation",
              "type": "select",
              "options": [
                "Professor",
                "Associate Professor",
                "Assistant Professor",
                "Head of Department",
                "Dean / Director"
              ],
              "required": true
            },
            {
              "name": "indiv_department",
              "label": "Department",
              "type": "select",
              "options": [
                "BCA",
                "MCA",
                "CS",
                "Cyber Security",
                "AI & ML",
                "Viscom",
                "Fashion Designing",
                "Biotechnology",
                "Mathematics",
                "Commerce (A&F)",
                "Commerce Shift 1",
                "Commerce Shift 2",
                "JMC",
                "LCS",
                "CSE",
                "IT",
                "EEE",
                "ECE",
                "MBA",
                "BBA"
              ],
              "required": true
            },
            {
              "name": "doj",
              "label": "Date of joining the insitution",
              "type": "date",
              "required": true
            },
            {
              "name": "total_experience",
              "label": "Total expereince of the faculty (considering previous experieice as well) in no. of years",
              "type": "number",
              "required": true
            },
            {
              "name": "document_link",
              "label": "Link to the relevant document",
              "type": "text",
              "required": false
            }
          ]
        },
        {
          "title": "Section 3: Full-Time Faculty Members Who Left After 30th April",
          "fields": [
            {
              "name": "left_faculty_name",
              "label": "Name of the Faculty",
              "type": "text",
              "required": false
            },
            {
              "name": "left_designation",
              "label": "Designation",
              "type": "select",
              "options": [
                "Professor",
                "Associate Professor",
                "Assistant Professor"
              ],
              "required": false
            },
            {
              "name": "left_department",
              "label": "Department",
              "type": "select",
              "options": [
                "BCA",
                "MCA",
                "CS",
                "Cyber Security",
                "AI & ML",
                "Viscom",
                "Fashion Designing",
                "Biotechnology",
                "Mathematics",
                "Commerce (A&F)",
                "Commerce Shift 1",
                "Commerce Shift 2",
                "JMC",
                "LCS",
                "CSE",
                "IT",
                "EEE",
                "ECE",
                "MBA",
                "BBA"
              ],
              "required": false
            },
            {
              "name": "left_doj",
              "label": "Date of joining",
              "type": "date",
              "required": false
            },
            {
              "name": "date_of_leaving",
              "label": "Date of leaving",
              "type": "date",
              "required": false
            },
            {
              "name": "left_document_link",
              "label": "Link to the relevant document",
              "type": "text",
              "required": false
            }
          ]
        }
      ]
    }
  },
  {
    "id": 7,
    "step_number": 7,
    "sheet_name": "Student enrollment",
    "template_name": "Student Admissions & Enrollment",
    "description": "Step 7: PG/UG sanctioned seats, admitted intake, quota counts, and demographic breakdown (A-7B).",
    "schema_json": {
      "title": "Student Admissions & Enrollment",
      "sections": [
        {
          "title": "Section 1: Programme Sanctioned Seats & Enrolled Intake (A-7B)",
          "fields": [
            {
              "name": "institution_name",
              "label": "Name of the Institution",
              "type": "select",
              "options": [
                "SRM Institute of Science and Technology, Ramapuram",
                "SRM IST - Faculty of Science and Humanities (FSH)",
                "SRM IST - Engineering and Technology (E&T)",
                "SRM IST - Management (FOM)",
                "SRM IST - Architecture (SEAD)"
              ],
              "required": true
            },
            {
              "name": "month_year",
              "label": "Month & Year",
              "type": "select",
              "options": [
                "August 2024",
                "September 2024",
                "October 2024",
                "November 2024",
                "December 2024",
                "January 2025",
                "February 2025",
                "March 2025",
                "April 2025",
                "May 2025",
                "June 2025",
                "July 2025"
              ],
              "required": true
            },
            {
              "name": "programme_name",
              "label": "Programme name",
              "type": "text",
              "required": true
            },
            {
              "name": "programme_code",
              "label": "Programme Code",
              "type": "text",
              "required": true
            },
            {
              "name": "department",
              "label": "Department",
              "type": "select",
              "options": [
                "BCA",
                "MCA",
                "CS",
                "Cyber Security",
                "AI & ML",
                "Viscom",
                "Fashion Designing",
                "Biotechnology",
                "Mathematics",
                "Commerce (A&F)",
                "Commerce Shift 1",
                "Commerce Shift 2",
                "JMC",
                "LCS",
                "CSE",
                "IT",
                "EEE",
                "ECE",
                "MBA",
                "BBA"
              ],
              "required": true
            },
            {
              "name": "seats_sanctioned",
              "label": "Number of seats sanctioned",
              "type": "number",
              "required": true
            },
            {
              "name": "students_enrolled",
              "label": "Number of students enrolled",
              "type": "number",
              "required": true
            },
            {
              "name": "percentage_enrolled",
              "label": "Percentage of students enrolled",
              "type": "text",
              "required": true
            }
          ]
        },
        {
          "title": "Section 2: Admitted Quota, Gender & Demographic Breakdown",
          "fields": [
            {
              "name": "admitted_mgmt",
              "label": "Admitted through (Count) - Mgmt",
              "type": "number",
              "required": true
            },
            {
              "name": "admitted_govt",
              "label": "Admitted through (Count) - Govt / Entrance Exam",
              "type": "number",
              "required": true
            },
            {
              "name": "gender_m",
              "label": "Gender (Count) - M",
              "type": "number",
              "required": true
            },
            {
              "name": "gender_f",
              "label": "Gender (Count) - F",
              "type": "number",
              "required": true
            },
            {
              "name": "hostel_ds_h",
              "label": "Hostel / DS (Count) - H",
              "type": "number",
              "required": true
            },
            {
              "name": "hostel_ds_ds",
              "label": "Hostel / DS (Count) - DS",
              "type": "number",
              "required": true
            },
            {
              "name": "other_states",
              "label": "Other States (Count)",
              "type": "number",
              "required": false
            },
            {
              "name": "other_country",
              "label": "Other Country (Count)",
              "type": "number",
              "required": false
            },
            {
              "name": "relevant_document_link",
              "label": "Link to the relavent document",
              "type": "text",
              "required": false
            }
          ]
        }
      ]
    }
  }
];

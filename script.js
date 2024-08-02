document.addEventListener("DOMContentLoaded", () => {
    const gradeList = document.getElementById("grade-list");
    const content = document.getElementById("content");
    const modal = document.getElementById("modal");
    const studentList = document.getElementById("student-list");
    const closeModal = document.querySelector(".close");
    const grades = [7, 8, 9, 10, 11, 12];

    grades.forEach(grade => {
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = `Grade ${grade}`;
        link.addEventListener("click", () => loadGrade(grade));
        listItem.appendChild(link);
        gradeList.appendChild(listItem);
    });

        async function loadGrade(grade) {
            const response = await fetch(`https://frenzvalios.com/api/sis/${grade}`);
            const data = await response.json();
            content.innerHTML = "";
            data.school.grades.forEach(gradeData => {
                gradeData.sections.forEach(section => {
                    const sectionDiv = document.createElement("div");
                    sectionDiv.className = "section";
                    sectionDiv.innerHTML = `
                        <h3>${section.name}</h3>
                        <p>Adviser: ${section.adviser}</p>
                    `;

                    if (gradeData.grade >= 11) {
                        section.strands.forEach(strand => {
                            const strandDiv = document.createElement("div");
                            strandDiv.className = "strand";
                            strandDiv.innerHTML = `
                                <h4>${strand.name}</h4>
                                <p>Adviser: ${strand.adviser || 'N/A'}</p>
                                <button class="view-students strand-button" data-students='${JSON.stringify(strand.students)}'>View Students</button>
                            `;
                            sectionDiv.appendChild(strandDiv);
                        });
                    } else {
                        const button = document.createElement("button");
                        button.className = "view-students";
                        button.textContent = "View Students";
                        button.setAttribute("data-students", JSON.stringify(section.students));
                        sectionDiv.appendChild(button);
                    }

                    content.appendChild(sectionDiv);
                    setTimeout(() => sectionDiv.classList.add('visible'), 100);
                });
            });

        document.querySelectorAll(".view-students").forEach(button => {
            button.addEventListener("click", () => {
                const students = JSON.parse(button.getAttribute("data-students"));
                showStudents(students);
            });
        });
    }

    function showStudents(students) {
        studentList.innerHTML = `
            <div class="students">
                <div>
                    <h4>Male Students</h4>
                    <ul>
                        ${students.male ? students.male.map(student => `<li>${student}</li>`).join('') : 'No male students'}
                    </ul>
                </div>
                <div>
                    <h4>Female Students</h4>
                    <ul>
                        ${students.female ? students.female.map(student => `<li>${student}</li>`).join('') : 'No female students'}
                    </ul>
                </div>
            </div>
        `;
        modal.style.display = "block";
    }

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
});
import {Component, OnInit} from '@angular/core';
import {Employee} from "./employee";
import {EmployeeService} from "./employee.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NgForm} from "@angular/forms";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    public employees: Employee[];
    public editEmployee: Employee | null;
    public deleteEmployee: Employee | null;

    constructor(private employeeService: EmployeeService) {
    }

    ngOnInit(): void {
        this.getEmployees();
    }

    public getEmployees(): void {
        this.employeeService.getEmployees().subscribe(
            // risposta 200 OK
            (response: Employee[]) => {
                this.employees = response;
            },
            // risposta di errore
            (error: HttpErrorResponse) => {
                alert(error.message);
            }
        )
    }

    public onOpenModal(employee: Employee|null, mode: string): void {
        const container = document.getElementById('main-container');
        const button = document.createElement('button');
        button.type = 'button';
        button.style.display = 'none';
        button.setAttribute('data-bs-toggle', 'modal');
        if (mode === 'add') {
            button.setAttribute('data-bs-target', '#addModal');
        }
        if (mode === 'edit') {
            this.editEmployee = employee ? employee : null;
            button.setAttribute('data-bs-target', '#updateModal');
        }
        if (mode === 'delete') {
            this.deleteEmployee = employee;
            button.setAttribute('data-bs-target', '#deleteModal');
        }
        container?.appendChild(button);
        button.click();
    }


    public onAddEmployee(addForm: NgForm): void {
        document.getElementById('add-employee-form')?.click();
        this.employeeService.addEmployees(addForm.value).subscribe(
            (response: Employee) => {
                console.log(response);
                this.getEmployees();
                addForm.reset();
            },
            (error: HttpErrorResponse) => {
                alert(error.message);
                addForm.reset();
            }
        )
    }

    public onUpdateEmployee(employee: Employee): void {
        document.getElementById('edit-employee-form')?.click();
        this.employeeService.updateEmployees(employee).subscribe(
            (response: Employee) => {
                console.log(response);
                this.getEmployees();
            },
            (error: HttpErrorResponse) => {
                alert(error.message);
            }
        )
    }


    public onDeleteEmployee(employeeId: number | undefined): void {
        document.getElementById('delete-modal-button')?.click();
        if (employeeId) {
            this.employeeService.deleteEmployees(employeeId).subscribe(
                (response: void) => {
                    this.getEmployees();
                },
                (error: HttpErrorResponse) => {
                    alert(error.message);
                }
            )
        }
    }

    public searchEmployee(key: string): void {
        const results: Employee[] = [];
        for (let employee of this.employees) {
            if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
                employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
                employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
                employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
                results.push(employee)
            }
        }
        this.employees = results;
        if (results.length === 0 || !key) {
            this.getEmployees();
        }
    }


}

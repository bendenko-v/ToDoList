import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ROUTES } from './routing/routes';
import { MatTabsModule } from '@angular/material/tabs';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CookieService } from 'ngx-cookie-service';
import { AuthPageComponent } from "./modules/auth/components/auth-page/auth-page.component";
import { FormFieldComponent } from "./modules/shared/components/form-field/form-field.component";
import { HeaderComponent } from "./modules/main/components/header/header.component";
import { RightSidePanelComponent } from "./modules/main/components/right-side-panel/right-side-panel.component";
import { LoginComponent } from "./modules/auth/components/login/login.component";
import { MenuComponent } from "./modules/main/components/menu/menu.component";
import { LayoutComponent } from "./modules/main/components/layout/layout.component";
import { SignUpComponent } from "./modules/auth/components/sign-up/sign-up.component";
import { ProfileComponent } from "./modules/main/components/profile/profile.component";
import { CsrfInterceptor } from "./modules/main/interseptor/csrf-interceptor.service";
import { CategoriesComponent } from './modules/board/components/categories/categories.component';
import { MatListModule } from "@angular/material/list";
import { EditCategoryComponent } from './modules/board/components/edit-category/edit-category.component';
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { PaginatorComponent } from './modules/shared/components/paginator/paginator.component';
import { MatSelectModule } from "@angular/material/select";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSortModule } from "@angular/material/sort";
import { GoalsComponent } from './modules/board/components/goals/goals.component';
import { GoalEditComponent } from './modules/board/components/goal-edit/goal-edit.component';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from "@angular/material/core";
import { MatCardModule } from "@angular/material/card";
import { GoalCardComponent } from './modules/board/components/goal-card/goal-card.component';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { CustomDateAdapter } from "./modules/shared/services/date-adapter.service";
import { GoalDetailComponent } from './modules/board/components/goal-detail/goal-detail.component';
import { MatMenuModule } from "@angular/material/menu";
import { CommentComponent } from './modules/board/components/comment/comment.component';
import { MatTooltipModule } from "@angular/material/tooltip";
import { BoardsComponent } from './modules/board/components/boards/boards.component';
import { BoardEditComponent } from './modules/board/components/board-edit/board-edit.component';
import { ParticipantsComponent } from './modules/shared/components/participants/participants.component';
import { VkLoggedInComponent } from './modules/auth/components/vk-logged-in/vk-logged-in.component';

const MY_FORMATS = {
  parse: {
    dateInput: 'dd.MM.YYYY'
  },
  display: {
    dateInput: 'dd.MM.YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
}

@NgModule({
  declarations: [
    AppComponent,
    AuthPageComponent,
    FormFieldComponent,
    HeaderComponent,
    LayoutComponent,
    LoginComponent,
    MenuComponent,
    SignUpComponent,
    RightSidePanelComponent,
    ProfileComponent,
    CategoriesComponent,
    EditCategoryComponent,
    PaginatorComponent,
    GoalsComponent,
    GoalEditComponent,
    GoalCardComponent,
    GoalDetailComponent,
    CommentComponent,
    VkLoggedInComponent,
    BoardsComponent,
    BoardEditComponent,
    ParticipantsComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    DragDropModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES),
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CsrfInterceptor,
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}

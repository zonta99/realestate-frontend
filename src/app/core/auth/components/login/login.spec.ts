// src/app/features/auth/components/login/login.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { LoginComponent } from './login';
import { AuthFacadeService } from '../../services/auth-facade';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: MockStore;
  let authFacade: jasmine.SpyObj<AuthFacadeService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  const initialState = {
    auth: {
      currentUser: null,
      isAuthenticated: false,
      isLoggingIn: false,
      error: null,
    }
  };

  beforeEach(async () => {
    const authFacadeSpy = jasmine.createSpyObj('AuthFacadeService', [
      'login', 'clearAuthError'
    ]);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        LoginComponent
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: AuthFacadeService, useValue: authFacadeSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    authFacade = TestBed.inject(AuthFacadeService) as jasmine.SpyObj<AuthFacadeService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authFacade.login when form is submitted with valid data', () => {
    component.loginForm.patchValue({
      username: 'testuser',
      password: 'password123'
    });

    component.onSubmit();

    expect(authFacade.login).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123'
    });
  });

  it('should not call authFacade.login when form is invalid', () => {
    component.loginForm.patchValue({
      username: '',
      password: 'short'
    });

    component.onSubmit();

    expect(authFacade.login).not.toHaveBeenCalled();
  });

  it('should toggle password visibility', () => {
    expect(component.hidePassword()).toBe(true);

    component.togglePasswordVisibility();

    expect(component.hidePassword()).toBe(false);
  });
});

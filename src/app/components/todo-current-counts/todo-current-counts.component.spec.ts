import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { TodoCurrentCountsComponent } from './todo-current-counts.component';
import {signal, WritableSignal} from '@angular/core';
import {ToDoStore} from '../../store/toDo.store';
import {TranslateModule} from '@ngx-translate/core';

describe('TodoCurrentCountsComponent', () => {

  class mockToDoStore {
    openCount: WritableSignal<number> = signal<number>(0);
    workCount: WritableSignal<number> = signal<number>(0);
    closedCount: WritableSignal<number> = signal<number>(0);
  }

  type initState = {
    store:mockToDoStore;
    fixture:ComponentFixture<TodoCurrentCountsComponent>;
    component:TodoCurrentCountsComponent;
  };

  function init():initState{
    let mockStore = new mockToDoStore();
    TestBed.configureTestingModule({
      imports: [TodoCurrentCountsComponent, TranslateModule.forRoot()],
    }).overrideComponent(TodoCurrentCountsComponent, {set: {providers: [{provide: ToDoStore, useValue: mockStore}]}} )
      .compileComponents();
    let fixture = TestBed.createComponent(TodoCurrentCountsComponent);
    let component = fixture.componentInstance;

    return {store:mockStore, fixture:fixture, component:component};
  }

  function getAndTest (compiled:Element, id:string, value:number):void{
    expect(compiled).toBeTruthy();
    let selector = compiled.querySelector(id);
    expect(selector).toBeTruthy();
    let count_text:string | null | undefined = selector?.textContent;
    expect(count_text).toBeTruthy();
    if(!count_text) return

    let index = count_text.indexOf('-');
    expect(index).toBeGreaterThan(-1);
    let num = parseInt(count_text.slice(index + 2, index + count_text.length));
    expect(num).not.toBeNaN();
    expect(num).toBe(value);
  }


  it('should create', () => {
    let p = init();
    p.fixture.detectChanges();
    expect(p.component).toBeTruthy();
  });


  it('should show counts', () => {
    let p = init();
    p.fixture.detectChanges();
    const compiled = p.fixture.debugElement.nativeElement;
    getAndTest(compiled, '#open_count', 0);
    getAndTest(compiled, '#work_count', 0);
    getAndTest(compiled, '#close_count', 0);
  })


  it('should update work count', fakeAsync(() => {
    let p = init();
    p.fixture.detectChanges();
    const compiled = p.fixture.debugElement.nativeElement;
    const id = '#work_count';
    const setValue = 8;
    getAndTest(compiled, id, 0);
    p.store.workCount.set(setValue);
    tick();
    p.fixture.detectChanges();
    getAndTest(compiled, id, setValue);
  }))


  it('should update open count', fakeAsync(() => {
    let p = init();
    p.fixture.detectChanges();
    const compiled = p.fixture.debugElement.nativeElement;

    const id = '#open_count';
    const setValue = 666;

    getAndTest(compiled, id, 0);
    p.store.openCount.set(setValue);
    tick();
    p.fixture.detectChanges();
    getAndTest(compiled, id, setValue);
  }))


  it('should update close count', fakeAsync(() => {
    let p = init();
    p.fixture.detectChanges();
    const compiled = p.fixture.debugElement.nativeElement;

    const id = '#close_count';
    const setValue = 16;

    getAndTest(compiled, id, 0);

    p.store.closedCount.set(setValue);
    tick();
    p.fixture.detectChanges();
    getAndTest(compiled, id, setValue);
  }))
});

import { FormControl, FormGroup } from "@angular/forms";
import { makeStore } from "./store";
import {
  combineLatest,
  debounceTime,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap
} from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { DataSourceQuery, ResultPage } from "../models/page";

const BASE_LIMIT = 10;
type ValueType = string | number | null | number[] | string[];

export class DataSource<Item, Form = undefined> {
  private state = makeStore({
    hasMore: false,
    isLoading: false,
    total: 0,
  });
  private destroy$ = new Subject<void>();
  private form!: FormGroup;

  searchForm!: FormGroup;
  hasPrev$!: Observable<boolean>;
  hasNext$!: Observable<boolean>;
  limit$!: Observable<number>;
  page$!: Observable<number>;
  totalPages$!: Observable<number>;
  isLoading$!: Observable<boolean>;
  matSource: MatTableDataSource<Item>;
  orderField$: Observable<string>;
  list$: Observable<Item[]>;

  constructor(
    searchFields: Record<keyof Form, ValueType>,
    handler: (query: DataSourceQuery<Form>) => Observable<ResultPage<Item>>,
    reload$: Observable<void> = of(undefined),
  ) {
    this.initFields(searchFields);

    this.matSource = new MatTableDataSource<Item>([]);

    const reloadData$ = reload$.pipe(startWith(null));

    const data$ = combineLatest([
      this.page$,
      this.limit$,
      this.form.get('orderField')!.valueChanges.pipe(
        startWith(this.form.get('orderField')!.value)
      ),
      this.searchForm.valueChanges.pipe(
        startWith(this.searchForm.getRawValue()),
      ),
      reloadData$,
    ]).pipe(
      tap(() => this.state.isLoading.next(true)),
      debounceTime(10),
      switchMap(([page, limit, orderField, search]) => {
        return handler({
          orderField,
          offset: (page - 1) * limit,
          limit,
          search
        });
      }),
      shareReplay({ refCount: true, bufferSize: 1 }),
    );

    data$.pipe(
      takeUntil(this.destroy$),
    ).subscribe((res) => {
      this.state.isLoading.next(false);
      this.state.hasMore.next(!!res.next);
      this.state.total.next(res.count);
      this.matSource.connect().next(res.results);
    })

    this.list$ = data$.pipe(map(res => res.results));
  }

  nextPage(): void {
    const prevPage = this.form.get('page')?.value || 0;
    this.form.patchValue({ page: prevPage + 1 });
  }

  prevPage(): void {
    const prevPage = this.form.get('page')?.value || 0;
    this.form.patchValue({ page: prevPage - 1 });
  }

  setLimit(limit: number): void {
    this.form.patchValue({ limit, page: 1 });
  }

  setOrderField(orderField: string): void {
    this.form.patchValue({ orderField });
  }

  destroy(): void {
    this.destroy$.next();
  }

  private initFields(searchFields: Record<keyof Form, ValueType>): void {
    const searchControls = Object.entries(searchFields)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: new FormControl(value) }), {});

    this.searchForm = new FormGroup(searchControls);

    this.isLoading$ = this.state.isLoading.asObservable();

    this.form = new FormGroup({
      page: new FormControl(1),
      orderField: new FormControl(''),
      limit: new FormControl(BASE_LIMIT)
    });

    this.limit$ = this.form.get('limit')!.valueChanges.pipe(
      startWith(this.form.get('limit')!.value),
      shareReplay({ refCount: true, bufferSize: 1 }),
    );
    this.page$ = this.form.get('page')!.valueChanges.pipe(
      startWith(this.form.get('page')!.value),
      shareReplay({ refCount: true, bufferSize: 1 }),
    );
    this.orderField$ = this.form.get('orderField')!.valueChanges.pipe(
      startWith(this.form.get('orderField')!.value),
      shareReplay({ refCount: true, bufferSize: 1 }),
    );
    this.totalPages$ = combineLatest([
      this.state.total,
      this.limit$
    ]).pipe(
      map(([total, limit]) => Math.ceil(total / limit)),
    );

    this.hasNext$ = this.state.hasMore;
    this.hasPrev$ = this.page$.pipe(
      map(page => page > 1)
    );
  }
}

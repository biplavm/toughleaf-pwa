/*! @toughleaf/platform-sdk v0.4.0
 * Browser bundle (self-contained)
 * https://github.com/toughleaf/toughleaf-platform-sdk
 */
import { Static, TSchema } from '@sinclair/typebox';
import { Observable } from 'rxjs';

export declare class AccountResource {
	private readonly http;
	private readonly cache?;
	constructor(http: HttpClient, cache?: ResourceCache | undefined);
	getUser(options?: QueryOptions): Promise<UserData>;
	observeUser(options?: QueryOptions): Subscribable<ResourceState<UserData>>;
	updateUser(payload: UpdateUserPayload): Promise<UserData>;
	updatePassword(payload: UpdatePasswordPayload): Promise<void>;
	getCompany(options?: QueryOptions): Promise<CompanyData>;
	observeCompany(options?: QueryOptions): Subscribable<ResourceState<CompanyData>>;
	createCompany(payload: Partial<CompanyData>): Promise<CompanyData>;
	updateCompany(payload: Partial<CompanyData>): Promise<CompanyData>;
	getNotificationPreferences(options?: QueryOptions): Promise<NotificationPreferences>;
	updateNotificationPreferences(payload: NotificationPreferences): Promise<NotificationPreferences>;
	listCompanyPeople(options?: QueryOptions): Promise<UserData[]>;
	updateCompanyUser(userId: string | number, payload: UpdateCompanyUserPayload): Promise<UserData>;
	private fetchUser;
	private fetchCompanyForMutate;
	private fetchCompany;
	private fetchNotificationPreferences;
	private fetchCompanyPeople;
	private mutateAndInvalidate;
	private fetchUserFresh;
	private fetchCompanyFresh;
}
export declare class AuthResource {
	private readonly http;
	constructor(http: HttpClient);
	login(info: UserLoginInfo): Promise<LoginResponse>;
	refresh(): Promise<LoginResponse>;
}
export declare class CompaniesResource {
	private readonly http;
	private readonly cache?;
	constructor(http: HttpClient, cache?: ResourceCache | undefined);
	createSearch(filter: CompanySearchFilter, options?: {
		fresh?: boolean;
	}): Promise<CompanySearchData>;
	search(filter: CompanySearchFilter, options?: {
		fresh?: boolean;
	}): Promise<CompanySearchData>;
	listSearchHistory(params?: CompanySearchHistoryParams, options?: QueryOptions): Promise<CompanySearchData[]>;
	getSearchResults(searchId: string, options?: QueryOptions): Promise<CompanySearchData>;
	saveFeedback(searchId: string, companyId: number, feedback: CompanySearchFeedbackPayload): Promise<void>;
	clearFeedback(searchId: string, companyId: number): Promise<void>;
	deleteSearch(searchId: string): Promise<void>;
	get(companyId: string | number, options?: QueryOptions): Promise<CompanyData>;
	private validateFilter;
	private normalizeSearch;
}
export declare class EnvResource {
	private readonly http;
	constructor(http: HttpClient);
	getConfig(): Promise<Record<string, unknown>>;
	getFeatures(): Promise<EnvFeatures>;
}
export declare class FetchTransport implements HttpTransport {
	private readonly baseUrl;
	private readonly getAccessToken?;
	private readonly fetchImpl;
	private readonly onUnauthorized?;
	private readonly activeAuthRequests;
	constructor(options: FetchTransportOptions);
	get apiBaseUrl(): string;
	abortAuthenticated(_reason?: string): void;
	request<T>(spec: RequestSpec): Promise<T>;
	private linkSignal;
	private executeRequest;
	private buildUrl;
	private headers;
	private handleResponse;
	/** Convenience wrappers used by resources */
	get<T>(path: string, params?: QueryParams, options?: Partial<RequestSpec>): Promise<T>;
	post<T>(path: string, body?: unknown, params?: QueryParams, options?: Partial<RequestSpec>): Promise<T>;
	put<T>(path: string, body?: unknown, params?: QueryParams, options?: Partial<RequestSpec>): Promise<T>;
	delete<T>(path: string, params?: QueryParams, options?: Partial<RequestSpec>): Promise<T>;
	getPublic<T>(path: string, params?: QueryParams, options?: Partial<RequestSpec>): Promise<T>;
}
export declare class HttpClient {
	readonly transport: FetchTransport;
	constructor(options: HttpClientOptions);
	get apiBaseUrl(): string;
	abortAuthenticated(reason?: string): void;
	request<T>(method: HttpMethod$1, resource: string, options?: {
		params?: QueryParams;
		body?: unknown;
		signal?: AbortSignal;
	}): Promise<ApiResponse<T>>;
	get<T>(resource: string, params?: QueryParams, options?: {
		signal?: AbortSignal;
	}): Promise<ApiResponse<T>>;
	post<T>(resource: string, body?: unknown, params?: QueryParams, options?: {
		signal?: AbortSignal;
	}): Promise<ApiResponse<T>>;
	put<T>(resource: string, body?: unknown, params?: QueryParams, options?: {
		signal?: AbortSignal;
	}): Promise<ApiResponse<T>>;
	delete<T>(resource: string, params?: QueryParams, options?: {
		signal?: AbortSignal;
	}): Promise<ApiResponse<T>>;
}
export declare class InvitesResource {
	private readonly http;
	private readonly cache?;
	private listRevision;
	constructor(http: HttpClient, cache?: ResourceCache | undefined);
	list(options?: QueryOptions): Promise<InviteData[]>;
	get(inviteId: string | number): Promise<InviteData>;
	create(payload: CreateInvitePayload): Promise<InviteData>;
	resend(inviteId: string | number): Promise<InviteData>;
	delete(inviteId: string | number): Promise<void>;
	accept(token: string, payload: AcceptInvitePayload): Promise<unknown>;
	private fetchList;
	private mutateAndInvalidate;
	/**
	 * Laravel caches GET responses by full URL. Its invalidation timestamp has
	 * second-level precision, so a mutation performed in the same second as a
	 * list read can otherwise replay the pre-mutation response. Advancing a
	 * stable per-client revision creates a fresh server cache key after each
	 * successful mutation without disabling Laravel caching altogether.
	 */
	private invalidateList;
}
export declare class LookupResource {
	private readonly http;
	constructor(http: HttpClient);
	listStates(): Promise<StateLookup[]>;
	listCapabilities(query?: QueryParams): Promise<{
		id: number;
		name: string;
	}[]>;
	listCertifications(query?: QueryParams): Promise<unknown[]>;
	listCertificationTree(): Promise<Record<string, unknown>>;
	listEthnicities(): Promise<string[]>;
	listUnions(query?: QueryParams): Promise<unknown[]>;
	listCommodityCodes(query?: QueryParams): Promise<unknown[]>;
	listBusinessSizes(): Promise<{
		id: number;
		text: string;
		code: string;
	}[]>;
	listCategories(): Promise<unknown[]>;
}
export declare class ProjectsResource {
	private readonly http;
	private readonly cache?;
	constructor(http: HttpClient, cache?: ResourceCache | undefined);
	list(params?: QueryParams, options?: QueryOptions): Promise<ProjectData[]>;
	get(projectId: string | number, options?: {
		full?: boolean;
	} & QueryOptions): Promise<ProjectData>;
	createOrUpdate(payload: CreateProjectPayload): Promise<ProjectData>;
	createOrUpdate(payload: UpdateProjectPayload, projectId: string | number): Promise<ProjectData>;
	delete(projectId: string | number): Promise<void>;
	batch(payload: ProjectBatchPayload): Promise<unknown>;
	addOrUpdateContact(projectId: string | number, payload: ProjectContactPayload, contactId?: string | number): Promise<unknown>;
	deleteContact(projectId: string | number, contactId: string | number): Promise<void>;
	listParticipants(projectId: string | number, options?: QueryOptions): Promise<ProjectParticipant[]>;
	addParticipants(projectId: string | number, payload: ProjectParticipantsPayload): Promise<unknown>;
	removeParticipants(projectId: string | number, payload: ProjectParticipantsPayload): Promise<unknown>;
	listSurveys(projectId: string | number, params?: QueryParams, options?: QueryOptions): Promise<ProjectSurveyData[]>;
	getSurvey(projectId: string | number, companyId: string | number, options?: QueryOptions): Promise<ProjectSurveyData>;
	upsertSurvey(projectId: string | number, companyId: string | number, payload: ProjectSurveyPayload): Promise<ProjectSurveyData>;
	updateSurveyWorkflow(projectId: string | number, companyId: string | number, payload?: ProjectSurveyWorkflowPayload): Promise<ProjectSurveyData>;
	getBidPackage(projectId: string | number, packageId: string | number, options?: QueryOptions): Promise<BidPackageData>;
	createOrUpdateBidPackage(projectId: string | number, payload: CreateBidPackagePayload): Promise<BidPackageData>;
	createOrUpdateBidPackage(projectId: string | number, payload: UpdateBidPackagePayload, packageId: string | number): Promise<BidPackageData>;
	deleteBidPackage(projectId: string | number, packageId: string | number): Promise<void>;
	batchBidPackages(projectId: string | number, payload: BidPackageBatchPayload): Promise<unknown>;
	private fetchList;
	private fetchOne;
	private fetchParticipants;
	private fetchBidPackage;
	private mutateAndInvalidate;
	private invalidateProject;
	private invalidateParticipants;
	private invalidateSurvey;
	private invalidateBidPackage;
}
export declare class ResourceCache {
	private readonly entries;
	private readonly transport;
	constructor(transport: HttpTransport);
	fetchQuery<T>(key: QueryKey, queryFn: QueryFn<T>, options?: QueryOptions): Promise<T>;
	observeQuery<T>(key: QueryKey, queryFn: QueryFn<T>, options?: QueryOptions): Subscribable<ResourceState<T>>;
	invalidate(keys: QueryKey | QueryKey[]): void;
	onAuthChange(authenticated: boolean): void;
	private getOrCreateEntry;
	private ensureObserveFetch;
	private runFetch;
	private setFetching;
	setQueryData<T>(key: QueryKey, data: T): void;
	private setInFlight;
	private scheduleGc;
	private clearGcTimer;
}
export declare class SessionStore {
	private readonly subject;
	private lastEvent?;
	readonly state$: Observable<Session | null>;
	getSession(): Session | null;
	setSession(session: Session | null, event?: SessionEvent): void;
	subscribe(callback: (session: Session | null, event?: SessionEvent) => void): {
		unsubscribe: () => void;
	};
}
export declare class ToughLeafApiError extends Error {
	readonly status: number;
	readonly body?: ApiErrorBody;
	constructor(status: number, message: string, body?: ApiErrorBody);
	get isUnauthorized(): boolean;
	get isValidationError(): boolean;
	get isRateLimited(): boolean;
}
/**
 * Framework-agnostic Tough Leaf API client (/api/v1).
 */
export declare class ToughLeafClient {
	readonly http: HttpClient;
	readonly session: SessionStore;
	readonly auth: AuthResource;
	readonly env: EnvResource;
	readonly lookup: LookupResource;
	readonly account: AccountResource;
	readonly invites: InvitesResource;
	readonly projects: ProjectsResource;
	readonly companies: CompaniesResource;
	readonly workflows: WorkflowsResource;
	private readonly cache;
	private accessToken?;
	private readonly externalGetAccessToken?;
	private readonly onLogin?;
	constructor(options: ToughLeafClientOptions);
	/** @deprecated Use createClient() — alias kept for v0.2 consumers */
	static create(options: ToughLeafClientOptions): ToughLeafClient;
	setAccessToken(token: string | undefined): void;
	getAccessToken(): string | undefined;
	resource<T>(key: QueryKey, queryFn: (signal: AbortSignal) => Promise<T>, options?: QueryOptions): Subscribable<ResourceState<T>>;
	invalidate(keys: QueryKey | QueryKey[]): void;
	login(info: UserLoginInfo): Promise<LoginResponse>;
	refresh(): Promise<LoginResponse>;
	logout(): void;
	private resolveAccessToken;
	private applySession;
	private clearSession;
}
export declare class ValidationError extends Error {
	readonly issues: unknown;
	constructor(message: string, issues: unknown);
}
export declare class WorkflowsResource {
	private readonly http;
	private readonly cache?;
	constructor(http: HttpClient, cache?: ResourceCache | undefined);
	list(options?: QueryOptions): Promise<WorkflowData[]>;
	get(workflowId: string, options?: QueryOptions): Promise<WorkflowData>;
}
/** Auth-scoped cache prefixes cleared on logout */
export declare const AUTH_CACHE_PREFIXES: QueryKey[];
export declare const ApiEnvelopeSchema: <T extends TSchema>(dataSchema: T) => import("@sinclair/typebox").TObject<{
	success: import("@sinclair/typebox").TLiteral<true>;
	data: T;
}>;
export declare const COMPANIES_PREFIX_KEY: readonly [
	"companies"
];
export declare const COMPANY_ME_KEY: readonly [
	"company",
	"me"
];
export declare const COMPANY_PEOPLE_KEY: readonly [
	"company",
	"people"
];
export declare const COMPANY_PREFIX_KEY: readonly [
	"company"
];
export declare const CompanyDataSchema: import("@sinclair/typebox").TObject<{
	id: import("@sinclair/typebox").TNumber;
	company_name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
	company_type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
}>;
export declare const INVITES_KEY: readonly [
	"invites",
	"list"
];
export declare const LoginResponseSchema: import("@sinclair/typebox").TObject<{
	access_token: import("@sinclair/typebox").TString;
	token_type: import("@sinclair/typebox").TLiteral<"Bearer">;
	id: import("@sinclair/typebox").TNumber;
	email: import("@sinclair/typebox").TString;
	first_name: import("@sinclair/typebox").TString;
	last_name: import("@sinclair/typebox").TString;
	status: import("@sinclair/typebox").TNumber;
	company_id: import("@sinclair/typebox").TNumber;
	company_type: import("@sinclair/typebox").TNumber;
}>;
export declare const NOTIFICATION_PREFS_KEY: readonly [
	"company",
	"notification-preferences"
];
export declare const NotificationPreferencesSchema: import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TUnknown>;
export declare const PROJECTS_LIST_KEY: readonly [
	"projects",
	"list"
];
export declare const PROJECTS_PREFIX_KEY: readonly [
	"projects"
];
export declare const USER_ME_KEY: readonly [
	"user",
	"me"
];
export declare const UserDataSchema: import("@sinclair/typebox").TObject<{
	id: import("@sinclair/typebox").TNumber;
	email: import("@sinclair/typebox").TString;
	first_name: import("@sinclair/typebox").TString;
	last_name: import("@sinclair/typebox").TString;
	status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
	company_id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
}>;
export declare const WORKFLOWS_PREFIX_KEY: readonly [
	"workflows"
];
export declare function bidPackageKey(projectId: string | number, packageId: string | number): QueryKey;
export declare function companyDetailKey(companyId: string | number): QueryKey;
export declare function companySearchHistoryKey(params?: Record<string, unknown>): QueryKey;
export declare function companySearchKey(searchId: string): QueryKey;
/** Preferred entry point for new consumers (v0.3+). */
export declare function createClient(options: ToughLeafClientOptions): ToughLeafClient;
export declare function decode<T extends TSchema>(schema: T, raw: unknown, label: string): Static<T>;
export declare function isAuthScopedKey(key: QueryKey): boolean;
export declare function participantsKey(projectId: string | number): QueryKey;
export declare function projectFullKey(projectId: string | number): QueryKey;
export declare function projectKey(projectId: string | number): QueryKey;
export declare function projectSurveyKey(projectId: string | number, companyId: string | number): QueryKey;
export declare function projectSurveysKey(projectId: string | number, params?: Record<string, unknown>): QueryKey;
export declare function projectsListKey(params?: Record<string, unknown>): QueryKey;
export declare function queryKeyMatchesPrefix(key: QueryKey, prefix: QueryKey): boolean;
export declare function serializeQueryKey(key: QueryKey): string;
export declare function workflowKey(workflowId: string): QueryKey;
export interface AcceptInvitePayload {
	/** Required by Laravel only when the invited email does not already belong to a user. */
	password?: string;
}
export interface ApiErrorBody {
	message: string;
	details?: Record<string, string | string[]>;
}
export interface ApiErrorResponse {
	success: false;
	error: ApiErrorBody;
}
export interface ApiResponse<T> {
	success: true;
	data: T;
	meta?: T extends unknown[] ? PaginationMeta : never;
}
export interface BidPackageBasePayload {
	name?: string;
	scope?: string | null;
	description?: string | null;
	approx_value?: number | null;
	is_public?: boolean;
	published?: boolean | null;
	bid_due_date?: string | null;
	bid_due_time?: string | null;
	bid_due_timezone?: string | null;
	billing_type?: string | null;
}
export interface BidPackageBatchPayload {
	bid_packages: CreateBidPackagePayload[];
}
export interface BidPackageData {
	id: number;
	name?: string;
	[key: string]: unknown;
}
export interface CompanyData {
	id: number;
	company_name?: string;
	company_type?: number;
	[key: string]: unknown;
}
export interface CompanySearchData {
	id: string;
	company_id?: number | null;
	bid_package_id?: number | null;
	filter: CompanySearchFilter;
	results: CompanyData[];
	results_feedback: SearchResultFeedbackData[];
	results_count?: number;
	processed?: boolean;
	created_at?: string;
	updated_at?: string;
	[key: string]: unknown;
}
export interface CompanySearchFeedbackPayload {
	score: number;
	failure_criteria?: Record<string, unknown> | null;
}
export interface CompanySearchFilter {
	keyword?: string;
	full_text_search?: string;
	ethnicities?: string[];
	city?: string;
	zip?: string[];
	radius?: number;
	longitude?: number;
	latitude?: number;
	states?: string[];
	commodity_code_ids?: number[];
	business_sizes?: string[];
	capability_ids?: number[];
	union_ids?: number[];
	labor_types?: string[];
	pays_prevailing_wage?: boolean;
	pays_davis_bacon_wage?: boolean;
	project_name?: string;
	project_client?: string;
	project_description?: string;
	flags?: string[];
	capabilities?: string[];
	bid_package_mode?: "inclusive" | "exclusive";
	bid_package_ids?: number[];
	certification_ids?: number[];
	certification_agencies?: string[];
	certification_types?: string[];
	bid_package_id?: number;
}
export interface CompanySearchHistoryParams extends QueryParams {
	limit?: number;
	all?: boolean;
	bid_package_id?: number;
}
export interface CompanyUserRolePayload {
	role_id: number;
	company_id?: number;
}
export interface CreateBidPackagePayload extends BidPackageBasePayload {
	name: string;
}
export interface CreateInvitePayload {
	email: string;
	first_name: string;
	last_name: string;
	role_id: number;
}
export interface CreateProjectPayload extends ProjectBasePayload {
	name: string;
	bid_packages?: CreateBidPackagePayload[];
}
export interface EnvFeatures {
	allow: string[];
	deny: string[];
}
export interface FetchTransportOptions {
	baseUrl: string;
	getAccessToken?: TokenProvider;
	fetchImpl?: typeof fetch;
	onUnauthorized?: () => void | Promise<void>;
}
export interface HttpClientOptions extends FetchTransportOptions {
}
export interface HttpTransport {
	readonly apiBaseUrl: string;
	request<T>(spec: RequestSpec): Promise<T>;
	abortAuthenticated(reason?: string): void;
}
export interface InviteData {
	id: string | number;
	email?: string;
	status?: string;
	[key: string]: unknown;
}
export interface LoginResponse {
	access_token: string;
	token_type: "Bearer";
	id: number;
	email: string;
	first_name: string;
	last_name: string;
	status: number;
	company_id: number;
	company_type: number;
}
export interface PaginationMeta {
	current_page: number;
	from: number;
	to: number;
	total: number;
	last_page: number;
	per_page: number;
}
export interface ProjectBasePayload {
	name?: string;
	description?: string | null;
	city?: string | null;
	state?: string | null;
	zip?: string | null;
	address?: string | null;
	published?: boolean | null;
	is_public?: boolean;
	workflow_id?: string | null;
	project_type?: "bid_procurement" | "list_of_qualified_firms" | "call_to_make_firms_aware" | null;
	project_documents_url?: string | null;
	project_notes?: string | null;
	bid_due_date?: string | null;
	bid_due_time?: string | null;
	bid_due_timezone?: string | null;
	req_certifications?: string[] | null;
	req_certification_agencies?: string[] | null;
	req_certification_types?: string[] | null;
	req_ethnicities?: string[] | null;
	req_union?: string | null;
	req_labor_type?: "open_shop" | "union" | "union_pla" | "prevailing_wage" | null;
	client_id?: number | null;
	manager_id?: number | null;
}
export interface ProjectBatchPayload {
	projects: CreateProjectPayload[];
	/** Required by Laravel for platform administrators creating on behalf of a client. */
	client_id?: number;
}
export interface ProjectContactPayload {
	name?: string;
	title?: string | null;
	email?: string | null;
	phone?: string | number | null;
	extension?: string | null;
	phone_mobile?: string | number | null;
	primary?: boolean;
}
export interface ProjectData {
	id: number;
	name?: string;
	slug?: string;
	[key: string]: unknown;
}
export interface ProjectParticipant {
	id?: number;
	user_id?: number;
	[key: string]: unknown;
}
export interface ProjectParticipantBidPackagePayload {
	id: number;
	invitation_status?: "invited" | "applied";
	activity_status?: "none" | "attached" | "detached";
	bid_status?: "none" | "bid_submitted" | "bid_awarded";
}
export interface ProjectParticipantMutationPayload {
	company_id: number;
	bid_package_ids?: number[];
	bid_packages?: ProjectParticipantBidPackagePayload[];
}
export interface ProjectSurveyAnswerPayload {
	survey_question_id: string;
	value?: unknown | null;
}
export interface ProjectSurveyData {
	id: string;
	project_id: number;
	company_id: number;
	invitation_status?: string;
	workflow_step_id?: string | null;
	workflow_prompt_id?: string | null;
	participant?: CompanyData;
	included_bid_packages?: Array<Record<string, unknown>>;
	workflow_step?: WorkflowStepData;
	workflow_prompt?: WorkflowPromptData;
	metadata?: Array<Record<string, unknown>>;
	[key: string]: unknown;
}
export interface ProjectSurveyIncludedBidPackagePayload {
	bid_package_id: number;
	invitation_status?: "none" | "invited" | "applied";
	activity_status?: "none" | "attached" | "detached";
	bid_status?: "none" | "bid_submitted" | "bid_awarded";
}
export interface ProjectSurveyPayload {
	assignee_id?: number | null;
	workflow_step_id?: string;
	workflow_prompt_id?: string;
	included_bid_packages?: ProjectSurveyIncludedBidPackagePayload[];
	survey_answers?: ProjectSurveyAnswerPayload[];
}
export interface QueryOptions {
	staleTime?: number;
	gcTime?: number;
	signal?: AbortSignal;
}
export interface RequestSpec {
	method: HttpMethod;
	path: string;
	params?: QueryParams;
	body?: unknown;
	signal?: AbortSignal;
	/** When true, request is aborted on logout / abortAuthenticated */
	authRequired?: boolean;
}
export interface ResourceState<T> {
	readonly status: ResourceStatus;
	readonly data?: T;
	readonly error?: Error;
	readonly isLoading: boolean;
	readonly isFetching: boolean;
	readonly isStale: boolean;
	readonly updatedAt: number;
}
export interface SearchResultFeedbackData {
	matched_company_id?: number;
	score: number;
	failure_criteria?: Record<string, unknown> | null;
	[key: string]: unknown;
}
export interface Session {
	readonly access_token: string;
	readonly expires_at?: number;
	readonly user?: UserData;
	readonly event?: SessionEvent;
}
export interface StateLookup {
	abbr: string;
	name: string;
}
export interface Subscribable<T> {
	subscribe(observer: (value: T) => void): Subscription;
}
export interface Subscription {
	unsubscribe(): void;
}
export interface ToughLeafClientOptions extends HttpClientOptions {
	onLogin?: (session: LoginResponse) => void | Promise<void>;
}
export interface UpdateCompanyUserPayload {
	company_id?: number;
	email?: string;
	first_name?: string;
	last_name?: string;
	roles?: CompanyUserRolePayload[] | null;
}
export interface UpdatePasswordPayload {
	current_password: string;
	new_password: string;
}
export interface UserData {
	id: number;
	email: string;
	first_name: string;
	last_name: string;
	status?: number;
	company_id?: number;
	[key: string]: unknown;
}
export interface UserLoginInfo {
	email: string;
	password: string;
}
export interface WorkflowData {
	id: string;
	name?: string;
	description?: string | null;
	steps?: WorkflowStepData[];
	[key: string]: unknown;
}
export interface WorkflowOptionData {
	id: string;
	label?: string;
	type?: string;
	dispatched_events?: Array<Record<string, unknown>>;
	next_workflow_step_id?: string | null;
	next_workflow_prompt_id?: string | null;
	[key: string]: unknown;
}
export interface WorkflowPromptData {
	id: string;
	label?: string;
	action_required?: boolean | number;
	options?: WorkflowOptionData[];
	[key: string]: unknown;
}
export interface WorkflowStepData {
	id: string;
	label?: string;
	prompts?: WorkflowPromptData[];
	[key: string]: unknown;
}
export type BidPackagePayload = CreateBidPackagePayload | UpdateBidPackagePayload;
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "HEAD";
export type NotificationPreferences = Record<string, unknown>;
export type ProjectParticipantsPayload = ProjectParticipantMutationPayload[];
export type ProjectPayload = CreateProjectPayload | UpdateProjectPayload;
export type ProjectSurveyWorkflowPayload = {
	workflow_option_id: string;
} | {
	workflow_step_id: string;
};
export type QueryFn<T> = (signal: AbortSignal) => Promise<T>;
export type QueryKey = readonly unknown[];
export type QueryParams = Record<string, string | number | boolean | undefined | null>;
export type ResourceStatus = "idle" | "loading" | "success" | "error";
export type SessionEvent = "INITIAL_SESSION" | "SIGNED_IN" | "SIGNED_OUT" | "TOKEN_REFRESHED" | "USER_UPDATED";
export type TokenProvider = () => string | undefined | Promise<string | undefined>;
export type UpdateBidPackagePayload = BidPackageBasePayload;
export type UpdateProjectPayload = ProjectBasePayload;
export type UpdateUserPayload = Partial<Pick<UserData, "email" | "first_name" | "last_name" | "status">> & Record<string, unknown>;
type HttpMethod$1 = "GET" | "POST" | "PUT" | "DELETE" | "HEAD";
type TokenProvider$1 = () => string | undefined | Promise<string | undefined>;

export {
	TokenProvider$1 as TokenProvider,
};

export {};

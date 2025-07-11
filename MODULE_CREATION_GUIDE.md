# Module Creation Guide for VSOCC

This guide outlines the process of creating new modules in the VSOCC project, including UI/UX standards, authorization setup, and routing conventions.

## Table of Contents
1. [Project Structure](#project-structure)
2. [UI/UX Standards](#uiux-standards)
3. [Authorization System](#authorization-system)
4. [Routing Conventions](#routing-conventions)
5. [Example Module Creation](#example-module-creation)

## Project Structure

### Directory Structure
```
app/
├── Http/
│   ├── Controllers/
│   │   └── Admin/
│   │       └── [ModuleName]/
│   │           └── [ModuleName]Controller.php
│   └── Requests/
│       └── [ModuleName]/
│           └── [ModuleName]Request.php
├── Models/
│   └── [ModuleName].php
├── Policies/
│   └── [ModuleName]Policy.php
└── Providers/
    └── AuthServiceProvider.php

resources/
└── views/
    └── admin/
        └── [module-name]/
            ├── index.blade.php
            ├── create.blade.php
            └── edit.blade.php
```

## UI/UX Standards

### Layout Template
All admin pages must extend the `tabler` template:
```php
@extends('layouts.tabler')

@section('page-title', 'Module Name')
@section('page-header', 'Module Name')
@section('page-description', 'Brief description of the module')

@section('content')
    <!-- Content here -->
@endsection
```

### Card Structure
All content must be wrapped in a card with the following structure:
```php
<div class="card">
    <div class="card-arrow">
        <div class="card-arrow-top-left"></div>
        <div class="card-arrow-top-right"></div>
        <div class="card-arrow-bottom-left"></div>
        <div class="card-arrow-bottom-right"></div>
    </div>
    <div class="card-header">
        <!-- Header content -->
    </div>
    <div class="card-body">
        <!-- Body content -->
    </div>
</div>
```

### Button Styles
- Primary actions: `btn btn-theme`
- Secondary actions: `btn btn-default`
- Danger actions: `btn btn-danger`

### Form Elements
- Use Bootstrap form classes
- Include validation error handling
- Use Alpine.js for dynamic interactions

## Authorization System

### 1. Define Permissions
Add new permissions in `app/Models/Permission.php`:
```php
public static function getPermissions(): array
{
    return [
        // ... existing permissions ...
        
        // New Module Permissions
        'new-module' => [
            'view' => 'View New Module',
            'create' => 'Create New Module',
            'edit' => 'Edit New Module',
            'delete' => 'Delete New Module',
        ],
    ];
}
```

### 2. Create Policy
Create a new policy in `app/Policies/[ModuleName]Policy.php`:
```php
<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class NewModulePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermission('new-module.view');
    }

    public function view(User $user, $model): bool
    {
        return $user->hasPermission('new-module.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('new-module.create');
    }

    public function update(User $user, $model): bool
    {
        return $user->hasPermission('new-module.edit');
    }

    public function delete(User $user, $model): bool
    {
        return $user->hasPermission('new-module.delete');
    }
}
```

### 3. Register Policy
Add the policy to `app/Providers/AuthServiceProvider.php`:
```php
protected $policies = [
    // ... existing policies ...
    NewModel::class => NewModulePolicy::class,
];
```

### 4. Controller Authorization
Use authorization in your controller:
```php
public function index()
{
    $this->authorize('viewAny', NewModel::class);
    // ... rest of the code
}
```

## Gates and Authorization

### Understanding Gates vs Policies

1. **Policies** are used for model-specific authorization (e.g., can a user edit this specific post?)
2. **Gates** are used for general authorization (e.g., can a user access the admin panel?)

### Gate Registration

In `app/Providers/AuthServiceProvider.php`, gates are automatically registered for all permissions:

```php
public function boot(): void
{
    // Register all permissions as gates
    foreach (Permission::all() as $permission) {
        Gate::define($permission->id, function (User $user) use ($permission) {
            return $user->role?->hasPermission($permission->id) ?? false;
        });
    }
}
```

### Using Gates in Views

```php
{{-- Check if user has permission --}}
@can('user-role.view')
    <a href="{{ route('admin.rbac.user-roles.index') }}">View User Roles</a>
@endcan

{{-- Check if user has multiple permissions --}}
@canany(['user-role.create', 'user-role.edit'])
    <div>User can create or edit user roles</div>
@endcanany
```

### Using Gates in Controllers

```php
// Check single permission
if (Gate::allows('user-role.view')) {
    // User has permission
}

// Check multiple permissions
if (Gate::any(['user-role.create', 'user-role.edit'])) {
    // User has at least one permission
}

// Check all permissions
if (Gate::all(['user-role.create', 'user-role.edit'])) {
    // User has all permissions
}
```

### Authorization in Blade Components

```php
<x-button 
    :disabled="! Gate::allows('user-role.create')"
    href="{{ route('admin.rbac.user-roles.create') }}"
>
    Create User Role
</x-button>
```

### Middleware Authorization

Add permission checks to routes using middleware:

```php
Route::middleware('can:user-role.view')->group(function () {
    Route::get('/user-roles', [UserRoleController::class, 'index']);
});
```

### Common Authorization Patterns

1. **Resource Authorization**
```php
// In controller
public function update(Request $request, User $user)
{
    $this->authorize('update', $user);
    // ... update logic
}

// In policy
public function update(User $authUser, User $targetUser): bool
{
    return $authUser->hasPermission('user-role.edit');
}
```

2. **Collection Authorization**
```php
// In controller
public function index()
{
    $this->authorize('viewAny', User::class);
    // ... index logic
}

// In policy
public function viewAny(User $user): bool
{
    return $user->hasPermission('user-role.view');
}
```

3. **Action Authorization**
```php
// In controller
public function store(Request $request)
{
    $this->authorize('create', User::class);
    // ... store logic
}

// In policy
public function create(User $user): bool
{
    return $user->hasPermission('user-role.create');
}
```

### Best Practices

1. **Always Use Policies for Model Actions**
   - Use `$this->authorize()` in controllers
   - Define clear policy methods
   - Keep policy logic simple and focused

2. **Use Gates for General Permissions**
   - Register gates for all permissions
   - Use `@can` directives in views
   - Use `Gate::allows()` for programmatic checks

3. **Cache Management**
   - Clear cache when roles/permissions change
   - Use `Cache::flush()` in role/permission updates

4. **Error Handling**
   - Always catch authorization exceptions
   - Provide clear error messages
   - Log authorization failures

5. **Testing Authorization**
```php
public function test_user_can_view_user_roles()
{
    $user = User::factory()->create();
    $user->role->permissions = ['user-role.view'];
    
    $this->actingAs($user)
        ->get(route('admin.rbac.user-roles.index'))
        ->assertStatus(200);
}
```

## Routing Conventions

### Route Structure
All admin routes should be grouped under the `admin` prefix:
```php
Route::prefix('admin')->name('admin.')->middleware(['auth'])->group(function () {
    Route::prefix('new-module')->name('new-module.')->group(function () {
        Route::get('/', [NewModuleController::class, 'index'])->name('index');
        Route::get('/create', [NewModuleController::class, 'create'])->name('create');
        Route::post('/', [NewModuleController::class, 'store'])->name('store');
        Route::get('/{model}/edit', [NewModuleController::class, 'edit'])->name('edit');
        Route::put('/{model}', [NewModuleController::class, 'update'])->name('update');
        Route::delete('/{model}', [NewModuleController::class, 'destroy'])->name('destroy');
    });
});
```

### Route Naming
- Use kebab-case for URLs
- Use dot notation for route names
- Follow RESTful conventions

## Example Module Creation

### 1. Create Model
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewModule extends Model
{
    protected $fillable = [
        'name',
        'description',
        // ... other fields
    ];
}
```

### 2. Create Controller
```php
<?php

namespace App\Http\Controllers\Admin\NewModule;

use App\Http\Controllers\Controller;
use App\Models\NewModule;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class NewModuleController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $this->authorize('viewAny', NewModule::class);
        $items = NewModule::all();
        return view('admin.new-module.index', compact('items'));
    }

    // ... other methods
}
```

### 3. Create Views
```php
{{-- index.blade.php --}}
@extends('layouts.vsocc_layout')

@section('page-title', 'New Module')
@section('page-header', 'New Module')
@section('page-description', 'Manage new module items')

@section('content')
<div class="card">
    <div class="card-arrow">
        <div class="card-arrow-top-left"></div>
        <div class="card-arrow-top-right"></div>
        <div class="card-arrow-bottom-left"></div>
        <div class="card-arrow-bottom-right"></div>
    </div>
    <div class="card-header">
        <div class="d-flex justify-content-between align-items-center">
            <h4 class="fw-bold h5">Items List</h4>
            <a href="{{ route('admin.new-module.create') }}" class="btn btn-theme">
                <i class="fa fa-plus"></i> Create New
            </a>
        </div>
    </div>
    <div class="card-body">
        <!-- Content here -->
    </div>
</div>
@endsection
```

## Additional Notes

### Cache Management
When updating roles or permissions, clear the cache:
```php
Cache::flush();
```

### Alpine.js Usage
For dynamic interactions, use Alpine.js:
```php
<div x-data="{ showDeleteConfirm: false }">
    <!-- Dynamic content -->
</div>
```

### Form Validation
Always include validation in your controllers:
```php
$validated = $request->validate([
    'name' => 'required|string|max:255',
    // ... other rules
]);
```

### Error Handling
Use try-catch blocks for database operations:
```php
try {
    $model->update($validated);
    return redirect()->route('admin.new-module.index')
        ->with('success', 'Item updated successfully.');
} catch (\Exception $e) {
    return back()->with('error', 'An error occurred while updating the item.');
}
``` 

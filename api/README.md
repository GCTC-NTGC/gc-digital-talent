## Getting Started

### Running standalone

1. Ensure php and composer are installed.
2. Install dependencies with `composer install`
3. Ensure you have a database running locally.
4. Copy .env.example to .env and configure your local environment. You will likely need to edit the DB variables to connect to your local database. Make sure to add a random string as your APP_KEY.
5. Ensure pdo_pgsql is enabled in php by uncommenting the line `extension=pdo_pgsql` in your php.ini file.
6. Run `php artisan migrate:fresh` to create database tables, and `php artisan db:seed` if you want to create test data.
7. Start a development server with `php -S localhost:8000 -t public`
8. Visit http://localhost:8000/graphiql to explore the API.

### Running with Docker containers

See `../infrastructure/README.md` for instructions for running this service, along with client services and a database, with a single docker compose command.

Note that you will still need to copy .env.example to .env and add an APP_KEY.

To initialize the database from inside the container, run `docker compose exec -w /home/site/wwwroot/api webserver sh -c "php artisan migrate:fresh --seed"`.

## Local Development

To improve your editing experience, run `php artisan lighthouse:ide-helper` (note: this is configured to run after composer install) and use an IDE plugin like [GraphQL](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql).

## Compiling the Schema

Some Lighthouse directives can manipulate the schema, like @whereConditions which generates an Input definition. This means that the final schema of this server may not quite match the `./graphql/schema.graphql` file.

If you need static access to the compiled schema, run `php artisan lighthouse:print-schema --write`, which outputs the compiled schema to `./storage/app/lighthouse-schema.graphql`.

_If any other projects need to reference this server's schema for code generation, that is the file they should use._

## Documentation

Documentation for the Laravel framework can be found on the [Laravel website](https://laravel.com/docs).

Documentation on the Lighthouse GraphQL library can be found [here](https://lighthouse-php.com/).
Lighthouse offers a [number of commands](https://lighthouse-php.com/6/api-reference/commands.html) which may be useful for developing your schema and data models:

## Development Guide

### Think Schema First

When designing the data model, define the graphql schema before considering the underlying implementation (i.e. the database). The schema should be designed to be as useful and easy to use as possible for consumers of the API, and does not need to match 1-to-1 with the database.

For example, while foreign keys (e.g. user_id) are important for defining relationships in the database, they should probably not appear in the schema. A consumer is much more likely to want to query for the related entity directly.

### Working with the Schema

**Case**: By convention, GraphQL fields should be camelCase, but SQL columns should be snake_case. Where this would cause a discrepancy, use the `@rename` directive to specify the DB column name. Also, GraphQL enums should be in ALL_CAPS.

**Nullability**: In general, GraphQL recommends [leaving most fields nullable](https://medium.com/@calebmer/when-to-use-graphql-non-null-fields-4059337f6fc8) (the default behaviour). Only the most critical fields of a type should be marked as non-null, such as id fields, the User.email field, or the group and level of a Classification.

**Enums**: Use enums for types with a small, well-defined and stable set of values. It's simple to expand the list later if necessary, but if anyone other than a dev may want to add arbitrary values in production, (e.g. adding new Skills) then this should be a Type instead, with a matching lookup table.

**Custom Scalars**: If a field is meant to represent a very specific kind of string or number, strongly consider defining a custom scalar. This makes the API more explicit, and keeps the relevant validation for that field in one specific place. Examples include emails, dates, and telephone numbers.

### Working with the Database

When adding any new types to the schema, you will need to add a corresponding table to the database. Possibly several, especially if many-to-many relationships are involved. This usually involves 3 steps:

1. Define a db [migration](https://laravel.com/docs/8.x/migrations) which creates the table.
2. Define a class which represents the [Eloquent](https://laravel.com/docs/8.x/eloquent) model in code.
3. Add any directives to the schema necessary for linking the Type to the Eloquent model.
4. (Optional) Create factory and db [seeders](https://laravel.com/docs/8.x/seeding) to generate test data.

#### DB Migrations

Generate a db migration that creates the table, using the command `php artisan make:migration Create<MyTableName>Table`.

- Table and column names should be snake_case. Table names should be pluralized. A foreign id should use the singular name for the table, plus `_id`. Pivot tables should be a combination of the two table names, singular, in alphabetical order. In general, follow the Laravel [key conventions](https://laravel.com/docs/8.x/eloquent-relationships).
- A new table should always include an id and timestamps, even if timestamps aren't in the schema. They're useful for debugging, and may be needed in the future.
- The `string` column type has a max length of **191** characters. Use it for fields which represent enums, or which will only represent simple, short strings (e.g. emails, phone numbers). For any free-form text use the `text` column type instead.
- For a field which represents a list of enums, use a `jsonb` column.
- It is good practice to make the nullability of a column explicit, with `->nullable()` or `->nullable(false)`. A non-nullable column is one that _must_ be set at creation, or should have a default value.
- Represent LocalizedStrings with a non-nullable `jsonb` column, and set the default with `->default(json_encode(['en' => '', 'fr' => '']))`.
- Use the `->foreignId` method to define foreign id columns.

#### Eloquent Models

Define new models in the App\Models folder.

- It is helpful to list the columns in class docstring.
- It is not necessary to define the [fillable array](https://laravel.com/docs/8.x/eloquent#mass-assignment).
- It _is_ necessary to define the [casts array](https://laravel.com/docs/8.x/eloquent-mutators#attribute-casting) for certain fields. Any json columns in the database must be cast to 'array' (such as LocalizedStrings or arrays of enums), and any dates or datetimes must be cast (besides `updated_at` and `created_at`, which Laravel casts by default).
- Remember to define any [relationships](https://laravel.com/docs/8.x/eloquent-relationships) on the new class, and on existing classes it relates to.
- Remember to define [return types](https://lighthouse-php.com/6/eloquent/nested-mutations.html#return-types-required) on your relationship methods so that Lighthouse can detect them.

#### Touching up the Schema

After the eloquent models are defined, add Lighthouse [directives](https://lighthouse-php.com/6/api-reference/directives.html#aggregate) to the schema to link your schema to Eloquent.

- Ensure your GraphQL Type and Eloquent Model share the same name.
- Add the `@rename` attribute on any fields that don't exactly match the name of an Eloquent field (most likely to due to clashing case conventions).
- Add [directives](https://lighthouse-php.com/6/eloquent/relationships.html) such as `@belongsTo` and `@hasMany` on fields that represent Eloquent relationships.

#### Seeding data

Most models should have an accompanying [Model Factory](https://laravel.com/docs/8.x/seeding#using-model-factories), which can be used to repeatedly generate items for local development, or unit tests.

You should probably ensure some amount are generated in the main DatabaseSeeder.php file, or in another seeder file which is called by DatabaseSeeder.

In the case of a lookup table expected to hold a fairly small amount of data, you may want to skip creating a Factory and simply define a seeder which adds specific values to the database, instead of random ones. In this case, you may want to use a method like `updateOrCreate` or `firstOrCreate` to ensure you don't add duplicate values when the seeder is run multiple times.

### GraphQL Mutations

- Add `@rename` directive to [match function name in model](https://github.com/nuwave/lighthouse/issues/1840#issuecomment-835461405)

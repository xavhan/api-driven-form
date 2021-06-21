<script lang="ts">
  import Form from "./Form.svelte";
  let submitted: NaiveFormData;

  const testSchema: NaiveFormSchema = {
    title: "Test form",
    properties: {
      name: {
        label: "Name Lab",
        type: "string",
      },
      age: {
        label: "Age",
        type: "number",
      },
      favNumber: {
        type: "string",
        label: "Favorite number",
        enum: [1, 2, 3],
        enumNames: ["one", "two", "three"],
      },
    },
    required: ["name", "age"],
  };
  const testUISchema: NaiveUISchema = {
    name: {
      classNames: "bg-blue text-red",
    },
    age: {
      classNames: "bg-red text-blue",
    },
    "ui:order": ["age", "favNumber", "name"],
  };
  const testFormData = {
    name: "nico",
    favNumber: 3,
  };

  const verifySelection = ({ detail }: { detail: NaiveFormData }) => {
    submitted = detail;
  };
</script>

<main>
  <pre>
testschema = {JSON.stringify(testSchema)}
testUISchema = {JSON.stringify(testUISchema)}
testFormData = {JSON.stringify(testFormData)}
	</pre>
  <Form
    schema={testSchema}
    uiSchema={testUISchema}
    formData={testFormData}
    on:submit={verifySelection}
  />
  <pre>
Subitted value: {JSON.stringify(submitted)}
	</pre>
</main>

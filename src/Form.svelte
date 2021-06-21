<script lang="ts">
  import classnames from "classnames";
  import { writable, derived } from "svelte/store";
  import { createEventDispatcher } from "svelte";
  import { ORDER } from "./ui-schema-props";

  export let schema: NaiveFormSchema;
  export let uiSchema: NaiveUISchema;
  export let formData: NaiveFormData;

  const removeEmptyKeys = (fd: NaiveFormData) =>
    Object.fromEntries(Object.entries(fd).filter(([_, v]) => v !== ""));
  const isCustomOrderValid = (customOrder: string[], schema: NaiveFormSchema) =>
    Object.keys(schema.properties).reduce((check, fieldId) => {
      return check && customOrder.includes(fieldId);
    }, true) && Object.keys(schema.properties).length === customOrder.length;

  const formState = writable(formData);
  const sanitizedFormState = derived(formState, removeEmptyKeys);
  const dispatcher = createEventDispatcher();

  const isRequired = (fieldId: FieldId): boolean =>
    (schema.required || []).includes(fieldId);

  const fieldEntries: [FieldId, Field][] =
    uiSchema[ORDER] && isCustomOrderValid(uiSchema[ORDER], schema)
      ? uiSchema[ORDER].map((fieldId: string) =>
          Object.entries<Field>(schema.properties).find(
            ([k, _]) => k === fieldId
          )
        )
      : Object.entries(schema.properties);
</script>

{#if schema.title}
  <h1>{schema.title}</h1>
{/if}

<form
  on:submit|preventDefault={() => dispatcher("submit", $sanitizedFormState)}
>
  {#each fieldEntries as [fieldId, field]}
    <div class="form-group field">
      {#if field.label}
        <label for={fieldId} class="control-label">
          {field.label}
          {#if isRequired(fieldId)}
            <span class="required">*</span>
          {/if}
        </label>
      {/if}

      {#if field.description}
        <p class="field-description">{field.description}</p>
      {/if}

      {#if field.enum}
        <select bind:value={$formState[fieldId]} required={isRequired(fieldId)}>
          <option />
          {#each field.enumNames || field.enum as choice, i}
            <option value={field.enum[i]}>
              {choice}
            </option>
          {/each}
        </select>
      {:else if field.type === "number"}
        <input
          id={fieldId}
          required={isRequired(fieldId)}
          name={fieldId}
          type="number"
          bind:value={$formState[fieldId]}
          class={classnames(uiSchema[fieldId].classNames)}
        />
      {:else}
        <input
          id={fieldId}
          required={isRequired(fieldId)}
          name={fieldId}
          type="text"
          bind:value={$formState[fieldId]}
          class={classnames(uiSchema[fieldId].classNames)}
        />
      {/if}
    </div>
  {/each}

  <button type="submit">Submit</button>
</form>

<style>
  /* for testing purpose */
  .bg-blue {
    background-color: blue;
  }
  .bg-red {
    background-color: red;
  }
  .text-blue {
    color: blue;
  }
  .text-red {
    color: red;
  }
</style>

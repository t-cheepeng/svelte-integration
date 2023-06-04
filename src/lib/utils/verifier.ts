export const verifyNotBlank = (formFields: (FormDataEntryValue | null | FormDataEntryValue[])[]) => {
	return formFields.map((field) => {
		if (field === null) {
			return false;
		}

		return field.length > 0;
	});
};

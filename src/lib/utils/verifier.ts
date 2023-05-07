export const verifyNotBlank = (formFields: (FormDataEntryValue | null)[]) => {
	return formFields.map((field) => {
		if (field === null) {
			return false;
		}

		return field.length > 0;
	});
};

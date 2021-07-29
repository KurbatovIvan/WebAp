package ru.torgovator;

public abstract class BuilderQuery {
	protected String SelectQuery;

	/** @return the selectQuery */
	public String getSelectQuery() {
		return SelectQuery;
	}

	public static class Builder {
		String innTorg;
		String from;
		String nameorg;
		String count;
		String order;
		String size;
		String offset;
		String fields;
		String userid;
		String mytorg;
		boolean itTorg;
		String where;

		public Builder itTorg(boolean val) {
			itTorg = val;
			return this;
		}

		public Builder nameorg(String val) {
			nameorg = val;
			return this;
		}

		public Builder count(String val) {
			count = val;
			return this;
		}

		public Builder userid(String val) {
			userid = val;
			return this;
		}

		public Builder fields(String val) {
			fields = val;
			return this;
		}

		public Builder from(String val) {
			from = val;
			return this;
		}

		public Builder size(String val) {
			size = val;
			return this;
		}

		public Builder offset(String val) {
			offset = val;
			return this;
		}

		public Builder where(String val) {
			where = val;
			return this;
		}

		public Builder order(String val) {
			order = val;
			return this;
		}

		public Builder innTorg(String val) {
			innTorg = val;
			return this;
		}

		public Builder mytorg(String val) {
			mytorg = val;
			return this;
		}

		//		public BuilderQueryMyOrg build() {
		//	return new BuilderQueryMyOrg(this);
		//}

	}

}

package ru.torgovator;

import ru.utils.StringUtils;

public class BuilderQueryOrg extends BuilderQuery {

	public static class BuilderOrg extends Builder {
		public BuilderQueryOrg build() {
			return new BuilderQueryOrg(this);
		}
	}

	public BuilderQueryOrg(Builder builder) {
		String select = "";
		String where = " where (1=1) " + StringUtils.getnotnull(builder.where);
		String from = " from " + builder.from;
		String count = builder.count;
		String nameorg = builder.nameorg;
		String order = StringUtils.getnotnull(builder.order);
		String size = StringUtils.getnotnull(builder.size);
		String offset = StringUtils.getnotnull(builder.offset);
		String fields = builder.fields;
		String userid = StringUtils.getnotnull(builder.userid);

		if ((nameorg != null) && (!nameorg.equals(""))) {

			if ((nameorg.length() <= 10) && nameorg.matches("[0-9]+")) {
				where = where.concat(" and (inn starting with " + nameorg + ")");
			} else {
				where = where.concat(
						"and (upper(FULLNAME) like upper('%" + nameorg + "%') or upper(FULLNAME) starting with upper('"
								+ nameorg + "%') or " + "(upper(POSTALADDRESS) like upper('%" + nameorg
								+ "%') or upper(POSTALADDRESS) starting with upper('" + nameorg + "%')) )");
			}

		}

		if ((count != null) && (count.equals("yes")))

		{
			select = "select count(*) ";
			fields = "";
			order = "";
		} else {
			select = "select ";

			if ((size != null) && (offset != null) && (!offset.equals("NaN")) && (!size.equals(""))) {
				select = select.concat(" first " + size + " skip " + offset + " ");
			}

		}

		SelectQuery = select + " " + fields + " " + from + " " + where + " " + order;
		SelectQuery = SelectQuery.replace("@GoogleID", userid);
	}
}

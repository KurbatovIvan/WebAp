package ru.torgovator;

import ru.utils.StringUtils;

// Тут спрячем всю херню
public class BuilderQueryMyOrg extends BuilderQuery {

	public static class BuilderMyOrg extends Builder {

		public BuilderQueryMyOrg build() {
			return new BuilderQueryMyOrg(this);
		}
	}

	public BuilderQueryMyOrg(Builder builder) {
		String select = "";
		String where = " where (1=1) and org.actual=1";
		String from = " from " + builder.from;
		String count = builder.count;
		String nameorg = builder.nameorg;
		String order = StringUtils.getnotnull(builder.order);
		String size = StringUtils.getnotnull(builder.size);
		String offset = StringUtils.getnotnull(builder.offset);
		String fields = builder.fields;
		String userid = StringUtils.getnotnull(builder.userid);

		if (!userid.equals("")) {
			where = where.concat(" and USERID='" + userid + "'");
		}
		if ((nameorg != null) && (!nameorg.equals(""))) {
			where = where.concat(
					"and (upper(FULLNAME) like upper('%" + nameorg + "%') or upper(FULLNAME) starting with upper('"
							+ nameorg + "%') or " + "(upper(POSTALADDRESS) like upper('%" + nameorg
							+ "%') or upper(POSTALADDRESS) starting with upper('" + nameorg + "%')) )");
		}

		if ((count != null) && (count.equals("yes"))) {
			select = "select count(*) ";
			fields = " ";
		} else {
			select = "select ";

			if ((size != null) && (offset != null) && (!offset.equals("NaN")) && (!size.equals(""))) {
				select = select.concat(" first " + size + " skip " + offset + " ");
			}

		}

		SelectQuery = select + " " + fields + " " + from + " " + where + " " + order;
	}

}

package ru.torgovator;

import ru.utils.StringUtils;

public class BuilderQueryZakupki extends BuilderQuery {
	private final String MyTorg44Fz = " and   (SUBSTRING (cust.purchasecode from 4 for 10) in (select mo.inn\r\n"
			+ "      from my_org mo where USERID='@GoogleID')) ";

	private final String MyTorg223Fz = " and (org.inn in (select mo.inn\r\n"
			+ "      from my_org mo where USERID='@GoogleID')) ";

	public static class BuilderZakupki extends Builder {
		public BuilderQueryZakupki build() {
			return new BuilderQueryZakupki(this);
		}
	}

	public BuilderQueryZakupki(Builder builder) {

		String innTorg = "";
		if ((builder.innTorg != null) && (builder.innTorg != "")) {
			innTorg = " and (substring(CUST.PURCHASECODE from 4 for 10)=@inn)";
			innTorg = innTorg.replace("@inn", builder.innTorg);
		}

		String select44Fz = "select distinct PO.OKPD2_CODE as OKPD2_CODE, cust.purchasecode AS ID, zk.placingway, zk.publishdate, iif(ZK.ZAKON = 0, 'http://zakupki.gov.ru/epz/order/notice/ea44/view/common-info.html?regNumber=' || zk.purchasenumber,'http://zakupki.gov.ru/223/purchase/public/purchase/info/common-info.html?regNumber=' || zk.purchasenumber) as TEXT, "
				+ "zk.purchaseobjectinfo AS title, " + "substring(zk.startdate from 1 for 16) AS adate, "
				+ "substring(zk.enddate from 1 for 16) AS enddate, " + "zk.maxprice AS maxprice, "
				+ "zk.responsibleorg_fullname  AS responsibleorg_fullname, "
				+ "org.inn AS INN_ZAK, org.shortname, org.fullname as ORGNAME, reg.name REGNAME, IIF(ZK.zakon=0, '44ФЗ','223ФЗ') AS ZAKON from zakupki zk "
				+ "inner join customerrequirements cust on (zk.id=cust.recordindex " + innTorg + ") "
				+ "inner join purchaseobjects po on (zk.id=po.recordindex) "
				+ "left join organization org on ((ORG.regnumber=cust.regnum) and org.actual=1) "
				+ "left join region reg on (reg.id=(org.inn / 100000000) and (org.actual=1))";
		String Select223Fz = "select distinct PO.OKPD2_CODE as OKPD2_CODE, zk.purchasenumber as ID, ZK.PLACINGWAY, ZK.PUBLISHDATE, iif(ZK.ZAKON = 0, 'http://zakupki.gov.ru/epz/order/notice/ea44/view/common-info.html?regNumber=' || zk.purchasenumber,'http://zakupki.gov.ru/223/purchase/public/purchase/info/common-info.html?regNumber=' || zk.purchasenumber) as TEXT, 				ZK.PURCHASEOBJECTINFO as TITLE, substring(ZK.STARTDATE from 1 for 16) as ADATE, substring(ZK.ENDDATE from 1 for 16) as ENDDATE, 				ZK.MAXPRICE as MAXPRICE, 				ZK.RESPONSIBLEORG_FULLNAME as RESPONSIBLEORG_FULLNAME, 				ORG.INN as INN_ZAK, 				ORG.SHORTNAME, 				ORG.FULLNAME as ORGNAME, 				REG.NAME REGNAME, 				iif(ZK.ZAKON = 0, '44ФЗ', '223ФЗ') as ZAKON 		from ZAKUPKI ZK 				left join PURCHASEOBJECTS PO on (ZK.ID = PO.RECORDINDEX) 				left join ORGANIZATION ORG on (ORG.regnumber = zk.customerregnum) left join region reg on (reg.id=(org.inn / 100000000)) ";
		String where44Fz = " where (1=1) " + StringUtils.getnotnull(builder.where);
		String where223Fz = where44Fz;

		if ((builder.mytorg != null) && (builder.mytorg.equals("yes"))
				&& ((builder.innTorg == null) || (builder.innTorg == ""))) {
			where44Fz = where44Fz + MyTorg44Fz;
			where223Fz = where223Fz + MyTorg223Fz;
		}

		String from = " from " + builder.from;
		String count = builder.count;
		String nameorg = builder.nameorg;
		String order = StringUtils.getnotnull(builder.order);
		String size = StringUtils.getnotnull(builder.size);
		String offset = StringUtils.getnotnull(builder.offset);
		String fields = builder.fields;
		String userid = StringUtils.getnotnull(builder.userid);

		String Query44Fz = select44Fz + " " + where44Fz + " and zk.zakon=0 " + order;
		String Query223Fz = Select223Fz + " " + where223Fz + " and zk.zakon=1 " + order;
		SelectQuery = Query44Fz + " union " + Query223Fz;
		SelectQuery = SelectQuery.replace("@GoogleID", userid);
	}

}

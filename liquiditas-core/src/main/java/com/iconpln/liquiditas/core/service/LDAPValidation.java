package com.iconpln.liquiditas.core.service;

public class LDAPValidation {
	public String Kode(String message) {
		String kode = "";
		if (message.contains("data 525")) {
			return "525";
		} else if (message.contains("data 52e")) {
			return "52e";
		} else if (message.contains("data 530")) {
			return "530";
		} else if (message.contains("data 531")) {
			return "531";
		} else if (message.contains("data 532")) {
			return "532";
		} else if (message.contains("data 533")) {
			return "533";
		} else if (message.contains("data 534")) {
			return "534";
		} else if (message.contains("data 701")) {
			return "701";
		} else if (message.contains("data 702")) {
			return "702";
		} else if (message.contains("data 703")) {
			return "703";
		}
		return kode;
	}

	public String Message(String Kode) {
		String message = "";
		try{
			EnumLDAP enumval = EnumLDAP.valueOf("LDAP" + Kode);
			switch (enumval) {
			case LDAP525:
				message = "user not found";
				break;
			case LDAP52e:
				message = "invalid credentials";
				break;
			case LDAP530:
				message = "not permitted to logon at this time";
				break;
			case LDAP531:
				message = "not permitted to logon at this workstation";
				break;
			case LDAP532:
				message = "password expired";
				break;
			case LDAP533:
				message = "account disabled";
				break;
			case LDAP534:
				message = "The user has not been granted the requested logon type at this machine";
				break;
			case LDAP701:
				message = "account expired";
				break;
			case LDAP773:
				message = "user must reset password";
				break;
			case LDAP775:
				message = "user account locked";
				break;
			default:
				break;
		}
		}catch(Exception e)
		{
			
		}
		return message;
	}

	public enum EnumLDAP {
		LDAP525, LDAP52e, LDAP530, LDAP531, LDAP532, LDAP533, LDAP534, LDAP701, LDAP773, LDAP775
	}
}

package com.iconpln.liquiditas.core.service;

import javax.naming.AuthenticationException;
import javax.naming.Context;
import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.*;
import java.util.*;

public class ActiveDirectory {

	LDAPValidation ldapValidation;

	private LDAP SettingLDAP(){
		LDAP dt = new LDAP();
//		dt.setHost("prima.plne.co.id");
//		dt.setHost("103.56.233.178");
//		dt.setHost("103.56.233.179");
		dt.setHost("10.1.8.20");
		return dt;

	}

	public String getLDAP(String userName, String Password) {
		LDAP ldap = SettingLDAP();
		String Msg = "UserName : " + userName;
		String sukses = "0";
		try {

			String user = "", domain = "pusat";
			List<String> Users = new ArrayList<String>(Arrays.asList(userName.split("\\\\")));
			try {
				user = Users.get(1);// "53DPK.agotest2";
				Msg = Msg + ", Users : " + user;
			} catch (Exception e) {
				e.getMessage();
			}
			try {
				domain = Users.get(0);
				Msg = Msg + ", Domain : " + domain;
			} catch (Exception e) {
				e.getMessage();
			}
			// set the LDAP authentication method
			String auth_method = "simple";
			if (ldap.getAuth_method() != null) {
				auth_method = ldap.getAuth_method();
				System.out.println("auth_method : " + auth_method);
			}
			// set the LDAP client Version
			String ldap_version = "3";
			if (ldap.getLdap_version() != null) {
				ldap_version = ldap.getLdap_version();
				System.out.println("ldap_version : " + ldap_version);
			}
			// This is our LDAP Server's IP
			String ldap_host = "10.1.8.20";
//			String ldap_host = "103.56.233.179";
//			String ldap_host = "103.56.233.178";
			if (ldap.getHost() != null) {
				ldap_host = ldap.getHost();
				System.out.println("ldap_host : " + ldap_host);
			}

			// This is our LDAP Server's Port
			String ldap_port = "389";
			if (ldap.getPort() != null) {
				ldap_port = ldap.getPort();
				System.out.println("ldap_port : " + ldap_port);
			}

			// This is our access ID --OU=ANONIM USER, OU=Accounts,
			// String ldap_dn = "CN= NAMA_ACTIVE_DIRECTORY ,OU=ANONIM USER,
			// OU=Accounts, DC=Pusat, DC=CORP, DC=PLN, DC=CO, DC=ID";
			// This is our access PW
			String ldap_pw = Password;// "Pa$$w0rd123#";
			// This is our base DN
			String base_dn = "DC=" + domain + ",DC=CORP, DC=PLN, DC=CO, DC=ID";

			DirContext ctx = null;
			Hashtable env = new Hashtable();

			// Here we store the returned LDAP object data
			String dn = "";
			// This will hold the returned attribute list
			Attributes attrs;

			env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
			env.put(Context.PROVIDER_URL, "ldap://" + ldap_host);// + ":" +
																	// ldap_port);
			env.put(Context.SECURITY_AUTHENTICATION, auth_method);
			env.put(Context.SECURITY_PRINCIPAL, user + "@" + domain + ".corp.pln.co.id");
			env.put(Context.SECURITY_CREDENTIALS, ldap_pw);
			env.put("java.naming.ldap.version", ldap_version);

			try {
				// System.out.println("Connecting to host " + ldap_host + " at
				// port " + ldap_port + "...");
				System.out.println();

				ctx = new InitialDirContext(env);
				System.out.println("LDAP authentication successful!");
				Msg = Msg + "\nMessage : LDAP authentication successful! Base dn : " + base_dn;
				sukses = user;
				// Specify the attribute list to be returned
				String[] attrIDs = { "memberOf" };

				SearchControls ctls = new SearchControls();
				ctls.setReturningAttributes(attrIDs);
				ctls.setSearchScope(SearchControls.SUBTREE_SCOPE);

				// Specify the search filter to match
				String filter = "(&(objectClass=user)(sAMAccountName=" + user + "))";

				// Search the subtree for objects using the given filter
				NamingEnumeration answer = ctx.search(base_dn, filter, ctls);

				// Print the answer
				// Search.printSearchEnumeration(answer);
				while (answer.hasMoreElements()) {
					SearchResult sr = (SearchResult) answer.next();
					dn = sr.getName();
					attrs = sr.getAttributes();

					// System.out.println("Found Object: " + dn + "," +
					// base_dn+", attrs "+attrs);
					Msg = Msg + "\nFound Object: " + dn + "," + base_dn + ", attrs " + attrs;
					if (attrs != null) {
						// we have some attributes for this object
						NamingEnumeration ae = attrs.getAll();
						while (ae.hasMoreElements()) {
							Attribute attr = (Attribute) ae.next();
							String attrId = attr.getID();
							// System.out.println("Found Attribute: " + attrId);
							Msg = Msg + "\nFound Attribute: " + attrId;
							Enumeration vals = attr.getAll();
							while (vals.hasMoreElements()) {
								String attr_val = (String) vals.nextElement();
								// System.out.println(attrId + ": " + attr_val);
								Msg = Msg + "\nFound : " + attrId + ": " + attr_val;
							}
						}
					}
				}

				// Close the context when we're done
				ctx.close();
			} catch (AuthenticationException authEx) {
				ldapValidation = new LDAPValidation();
				//authEx.printStackTrace();
				// System.out.println("LDAP authentication failed!");
				Msg = Msg + ", Message : LDAP authentication failed! (" + authEx.getMessage() + ") - "
						+ ldapValidation.Message(ldapValidation.Kode(authEx.getMessage()));
				sukses = "0";
			} catch (NamingException namEx) {
				// System.out.println("LDAP connection failed!");
				//namEx.printStackTrace();
				Msg = Msg + ", Message : LDAP connection failed! (" + namEx.getMessage() + ")";
				sukses = "0";
			} catch (Exception e) {
				e.printStackTrace();
				Msg = Msg + e.getMessage();
				sukses = "0";
			}
			System.out.println(Msg);
		} catch (Exception e) {
			e.getMessage();
			System.out.println("Error " + e);
		}

		System.out.println("msg : "+ Msg);
		return sukses;
	}
}
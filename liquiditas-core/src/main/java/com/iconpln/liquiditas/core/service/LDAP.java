package com.iconpln.liquiditas.core.service;

public class LDAP {
	String host;
	String port;
	String auth_method;
	String ldap_version;
	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public String getPort() {
		return port;
	}

	public void setPort(String port) {
		this.port = port;
	}
	
	public String getAuth_method() {
		return auth_method;
	}

	public void setAuth_method(String auth_method) {
		this.auth_method = auth_method;
	}

	public String getLdap_version() {
		return ldap_version;
	}

	public void setLdap_version(String ldap_version) {
		this.ldap_version = ldap_version;
	}

	public LDAP(String host, String port, String auth_method, String ldap_version) {
		super();
		this.host = host;
		this.port = port;
		this.auth_method = auth_method;
		this.ldap_version = ldap_version;
	}

	public LDAP()
	{
		
	}
}

package com.chakra.Address;

import java.io.BufferedReader;
import java.io.Console;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class RegexTestHarness {

    public static void main(String[] args) throws IOException{
       /* Console console = System.console();
        if (console == null) {
            System.err.println("No console.");
            System.exit(1);
        }*/
    	BufferedReader console = new BufferedReader(new InputStreamReader(
	            System.in));

        while (true) {
        	
        	//System.out.println("%nEnter your regex: ");
        	String pp1 ="([0-9]{10})(?![0-9])";

            /*Pattern pattern = 
            Pattern.compile(pp1);*/

            System.out.println("Enter input string to search: ");
           // Matcher matcher = 
          //  pattern.matcher(console.readLine());
            if (console.readLine().matches(pp1))
            	System.out.println("Matched");

          /*  boolean found = false;
            while (matcher.find()) {
            	String S1 = String.format("I found the text \"%s\" starting at index %d and ending at index %d.%n", matcher.group(), matcher.start(),matcher.end());
            	System.out.println(S1);
                found = true;
            }
            if(!found){
                System.out.println("No match found.%n");
            }*/
        }
    }
}

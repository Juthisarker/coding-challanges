import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        DNSResolver resolver = new DNSResolver();

        try {
            String hostname = "example.com";
            String ipAddress = resolver.resolve(hostname);
            System.out.println("IP Address for " + hostname + ": " + ipAddress);
        } catch (IOException e) {
            System.err.println("Error resolving hostname: " + e.getMessage());
        }
    }
}

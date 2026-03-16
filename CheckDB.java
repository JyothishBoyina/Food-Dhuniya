import java.sql.*;

public class CheckDB {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/fooddhuniya?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
        String user = "root";
        String password = "Jyothish@77";
        
        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            System.out.println("Connected to the database!");
            String query = "SELECT email, name, role FROM users";
            try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(query)) {
                System.out.println("Users in database:");
                while (rs.next()) {
                    System.out.println("Email: " + rs.getString("email") + ", Name: " + rs.getString("name") + ", Role: " + rs.getString("role"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
